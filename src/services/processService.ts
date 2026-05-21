import fs from "node:fs/promises";
import { execa, ExecaError } from "execa";
import { PortxError } from "../utils/errors.js";
import { cleanCommand } from "../utils/format.js";

export class ProcessService {
  public async getProcessName(pid: number): Promise<string> {
    const output = await this.ps(pid, ["-p", String(pid), "-o", "comm="]);
    return output.trim() || "unknown";
  }

  public async getCommand(pid: number): Promise<string> {
    const output = await this.ps(pid, ["-p", String(pid), "-o", "command="]);
    return cleanCommand(output) || "unknown";
  }

  public async getWorkingDirectory(pid: number): Promise<string | null> {
    try {
      const output = await execa("lsof", ["-a", "-p", String(pid), "-d", "cwd", "-Fn"], {
        reject: false
      });

      if (output.exitCode !== 0) {
        return await this.getCwdFromProcFs(pid);
      }

      const cwd = output.stdout
        .split("\n")
        .find((line) => line.startsWith("n"))
        ?.slice(1)
        .trim();

      return cwd || (await this.getCwdFromProcFs(pid));
    } catch {
      return await this.getCwdFromProcFs(pid);
    }
  }

  public async getStartedAt(pid: number): Promise<Date | null> {
    const output = await execa("ps", ["-p", String(pid), "-o", "lstart="], { reject: false });

    if (output.exitCode !== 0) {
      return null;
    }

    const startedAt = new Date(output.stdout.trim());
    return Number.isNaN(startedAt.getTime()) ? null : startedAt;
  }

  public async isRunning(pid: number): Promise<boolean> {
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  }

  public async terminate(pid: number, signal: NodeJS.Signals): Promise<void> {
    try {
      process.kill(pid, signal);
    } catch (error) {
      throw new PortxError(`Could not send ${signal} to PID ${pid}.`, "KILL_FAILED");
    }
  }

  public async waitForExit(pid: number, timeoutMs = 1800): Promise<boolean> {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      if (!(await this.isRunning(pid))) {
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return !(await this.isRunning(pid));
  }

  private async ps(pid: number, args: string[]): Promise<string> {
    const output = await execa("ps", args, { reject: false });

    if (output.exitCode !== 0) {
      throw new PortxError(`Could not read process details for PID ${pid}.`, "PS_FAILED");
    }

    return output.stdout;
  }

  private async getCwdFromProcFs(pid: number): Promise<string | null> {
    try {
      return await fs.readlink(`/proc/${pid}/cwd`);
    } catch {
      return null;
    }
  }
}

export const isExecaError = (error: unknown): error is ExecaError => {
  return error instanceof Error && "shortMessage" in error;
};
