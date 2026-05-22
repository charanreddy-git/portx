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

export const getProjectHint = (processInfo: PortProcess): string | null => {
  // Always filter out low system ports
  if (processInfo.port < 1024) {
    return null;
  }

  // Filter out standard macOS system daemons
  const procName = path.basename(processInfo.processName);
  if (systemProcessNames.has(procName)) {
    return null;
  }

  const command = processInfo.command.toLowerCase();
  const cwd = processInfo.cwd;
  const home = os.homedir();

  // 1. If running inside the user's home directory
  if (cwd?.startsWith(`${home}${path.sep}`) || cwd === home) {
    const relativePath = cwd === home ? "" : cwd.slice(home.length + 1).toLowerCase();
    const [firstSegment] = relativePath.split(path.sep);

    // Any non-hidden user folder except system ~/Library is treated as a project
    if (firstSegment && !firstSegment.startsWith(".") && firstSegment !== "library") {
      return path.basename(cwd);
    }
  }

  // 2. Fallback: Check if the command or process name contains common development runtime keywords
  const devKeywords = [
    "node", "npm", "npx", "pnpm", "yarn", "bun", "deno",
    "python", "pipenv", "poetry", "ruby", "rails", "irb",
    "java", "dotnet", "go", "docker", "rust", "cargo",
    "http-server", "live-server", "serve", "caddy", "nginx",
    "server", "hugo", "jekyll", "gatsby", "astro", "remix",
    "next", "nuxt", "vite", "webpack", "mix", "phoenix",
    "php", "laravel", "artisan", "symfony"
  ];

  const searchString = `${command} ${procName.toLowerCase()}`;
  if (devKeywords.some((keyword) => searchString.includes(keyword))) {
    return cwd ? path.basename(cwd) : (processInfo.processName || "server");
  }

  return null;
};

