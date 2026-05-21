import { execa } from "execa";
import type { ListedPortProcess, PortProcess } from "../types/index.js";
import { PortxError } from "../utils/errors.js";
import { getProjectHint } from "./projectPortFilter.js";
import { ProcessService } from "./processService.js";

interface LsofListener {
  pid: number;
  processName: string;
  port: number;
}

export class PortService {
  public constructor(private readonly processService = new ProcessService()) {}

  public async inspect(port: number): Promise<PortProcess | null> {
    const pid = await this.findPidByPort(port);

    if (!pid) {
      return null;
    }

    const [processName, command, cwd, startedAt, isRunning] = await Promise.all([
      this.processService.getProcessName(pid),
      this.processService.getCommand(pid),
      this.processService.getWorkingDirectory(pid),
      this.processService.getStartedAt(pid),
      this.processService.isRunning(pid)
    ]);

    return {
      port,
      pid,
      processName,
      command,
      cwd,
      status: isRunning ? "running" : "unknown",
      startedAt
    };
  }

  public async findPidByPort(port: number): Promise<number | null> {
    const output = await execa("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"], {
      reject: false
    });

    if (output.exitCode === 1 && output.stdout.trim() === "" && output.stderr.trim() === "") {
      return null;
    }

    if (output.exitCode !== 0) {
      throw new PortxError(`Could not inspect port ${port}. Make sure lsof is available.`, "LSOF_FAILED");
    }

    const [firstPid] = output.stdout
      .split("\n")
      .map((line) => Number(line.trim()))
      .filter((value) => Number.isInteger(value));

    return firstPid ?? null;
  }

  public async listProjectPorts(): Promise<ListedPortProcess[]> {
    const listeners = await this.listListeningPorts();
    const hydrated = await Promise.all(listeners.map((listener) => this.hydrateListedPort(listener)));

    return hydrated
      .filter((processInfo): processInfo is ListedPortProcess => processInfo !== null)
      .sort((left, right) => left.port - right.port);
  }

  private async hydrateListedPort(listener: LsofListener): Promise<ListedPortProcess | null> {
    const [command, cwd, isRunning] = await Promise.all([
      this.processService.getCommand(listener.pid).catch(() => listener.processName),
      this.processService.getWorkingDirectory(listener.pid).catch(() => null),
      this.processService.isRunning(listener.pid).catch(() => false)
    ]);

    const processInfo: PortProcess = {
      port: listener.port,
      pid: listener.pid,
      processName: listener.processName,
      command,
      cwd,
      status: isRunning ? "running" : "unknown",
      startedAt: null
    };

    const projectHint = getProjectHint(processInfo);
    return projectHint ? { ...processInfo, projectHint } : null;
  }

  private async listListeningPorts(): Promise<LsofListener[]> {
    const output = await execa("lsof", ["-nP", "-iTCP", "-sTCP:LISTEN", "-Fpcn"], {
      reject: false
    });

    if (output.exitCode === 1 && output.stdout.trim() === "" && output.stderr.trim() === "") {
      return [];
    }

    if (output.exitCode !== 0) {
      throw new PortxError("Could not list listening ports. Make sure lsof is available.", "LSOF_FAILED");
    }

    const listeners: LsofListener[] = [];
    let pid: number | null = null;
    let processName = "unknown";

    for (const line of output.stdout.split("\n")) {
      if (line.startsWith("p")) {
        pid = Number(line.slice(1));
        processName = "unknown";
        continue;
      }

      if (line.startsWith("c")) {
        processName = line.slice(1).trim() || "unknown";
        continue;
      }

      if (!line.startsWith("n") || !pid) {
        continue;
      }

      const port = this.extractPort(line.slice(1));

      if (port) {
        listeners.push({ pid, processName, port });
      }
    }

    return this.dedupeListeners(listeners);
  }

  private extractPort(address: string): number | null {
    const match = /:(\d+)(?:\s|$)/.exec(address);

    if (!match?.[1]) {
      return null;
    }

    const port = Number(match[1]);
    return Number.isInteger(port) ? port : null;
  }

  private dedupeListeners(listeners: LsofListener[]): LsofListener[] {
    const seen = new Set<string>();

    return listeners.filter((listener) => {
      const key = `${listener.pid}:${listener.port}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }
}
