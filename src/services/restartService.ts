import { execa } from "execa";
import type { RestartResult } from "../types/index.js";
import { PortxError } from "../utils/errors.js";
import { PortService } from "./portService.js";
import { StopService } from "./stopService.js";
import { StorageService } from "../storage/storageService.js";

export class RestartService {
  public constructor(
    private readonly storageService = new StorageService(),
    private readonly portService = new PortService(),
    private readonly stopService = new StopService()
  ) {}

  public async rememberFromPort(port: number): Promise<void> {
    const processInfo = await this.portService.inspect(port);

    if (!processInfo || !processInfo.cwd || processInfo.command === "unknown") {
      return;
    }

    await this.storageService.set(port, {
      cmd: processInfo.command,
      cwd: processInfo.cwd,
      pid: processInfo.pid
    });
  }

  public async restart(port: number): Promise<RestartResult> {
    const metadata = await this.storageService.get(port);

    if (!metadata) {
      const currentProcess = await this.portService.inspect(port);

      if (currentProcess?.cwd && currentProcess.command !== "unknown") {
        await this.storageService.set(port, {
          cmd: currentProcess.command,
          cwd: currentProcess.cwd,
          pid: currentProcess.pid
        });

        throw new PortxError(
          `Captured restart metadata for port ${port}. Run "portx restart ${port}" again to restart it.`,
          "RESTART_METADATA_CAPTURED"
        );
      }

      throw new PortxError(
        `No restart metadata for port ${port}. Inspect or stop the process once before restarting.`,
        "RESTART_METADATA_MISSING"
      );
    }

    const currentProcess = await this.portService.inspect(port);
    const previousPid = currentProcess?.pid ?? metadata.pid;

    if (currentProcess) {
      await this.stopService.stop(port);
    }

    const child = execa(metadata.cmd, {
      cwd: metadata.cwd,
      shell: true,
      detached: true,
      stdio: "ignore"
    });

    child.unref();

    await this.storageService.set(port, {
      ...metadata,
      pid: child.pid ?? metadata.pid
    });

    return {
      port,
      previousPid,
      newPid: child.pid ?? metadata.pid,
      cmd: metadata.cmd,
      cwd: metadata.cwd
    };
  }
}
