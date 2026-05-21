import type { StopResult } from "../types/index.js";
import { PortxError } from "../utils/errors.js";
import { PortService } from "./portService.js";
import { ProcessService } from "./processService.js";

export class StopService {
  public constructor(
    private readonly portService = new PortService(),
    private readonly processService = new ProcessService()
  ) {}

  public async stop(port: number): Promise<StopResult> {
    const processInfo = await this.portService.inspect(port);

    if (!processInfo) {
      throw new PortxError(`Nothing is listening on port ${port}.`, "PORT_EMPTY");
    }

    await this.processService.terminate(processInfo.pid, "SIGTERM");

    if (await this.processService.waitForExit(processInfo.pid)) {
      return {
        port,
        pid: processInfo.pid,
        processName: processInfo.processName,
        signal: "SIGTERM"
      };
    }

    await this.processService.terminate(processInfo.pid, "SIGKILL");
    await this.processService.waitForExit(processInfo.pid, 900);

    return {
      port,
      pid: processInfo.pid,
      processName: processInfo.processName,
      signal: "SIGKILL"
    };
  }
}
