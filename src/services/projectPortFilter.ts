import os from "node:os";
import path from "node:path";
import type { PortProcess } from "../types/index.js";

const systemProcessNames = new Set([
  "AirPlayXPCHelper",
  "ControlCenter",
  "coreaudiod",
  "launchd",
  "mDNSResponder",
  "rapportd",
  "sharingd",
  "smbd",
  "sshd",
  "trustd"
]);

const devCommandMarkers = [
  "bun ",
  "deno ",
  "docker-proxy",
  "dotnet ",
  "go run",
  "java ",
  "next",
  "node ",
  "npm ",
  "pnpm ",
  "python",
  "rails",
  "ruby ",
  "tsx",
  "vite",
  "yarn "
];

const devDirectoryMarkers = [
  "app",
  "apps",
  "code",
  "dev",
  "git",
  "github",
  "projects",
  "repo",
  "repos",
  "src",
  "work",
  "workspace"
];

export const getProjectHint = (processInfo: PortProcess): string | null => {
  if (processInfo.port < 1024 || systemProcessNames.has(path.basename(processInfo.processName))) {
    return null;
  }

  const command = processInfo.command.toLowerCase();
  const cwd = processInfo.cwd;
  const home = os.homedir();

  if (cwd?.startsWith(`${home}${path.sep}`)) {
    const relativePath = cwd.slice(home.length + 1).toLowerCase();
    const [firstSegment] = relativePath.split(path.sep);

    if (firstSegment && !firstSegment.startsWith(".")) {
      if (devDirectoryMarkers.some((marker) => relativePath.includes(marker))) {
        return path.basename(cwd);
      }

      if (devCommandMarkers.some((marker) => command.includes(marker))) {
        return path.basename(cwd);
      }
    }
  }

  if (devCommandMarkers.some((marker) => command.includes(marker))) {
    return path.basename(processInfo.command.split(" ")[0] ?? processInfo.processName);
  }

  return null;
};
