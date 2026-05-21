export type ProcessStatus = "running" | "stopped" | "unknown";

export interface PortProcess {
  port: number;
  pid: number;
  processName: string;
  command: string;
  cwd: string | null;
  status: ProcessStatus;
  startedAt: Date | null;
}

export interface ListedPortProcess extends PortProcess {
  projectHint: string;
}

export interface RestartMetadata {
  cmd: string;
  cwd: string;
  pid: number;
}

export type RestartStore = Record<string, RestartMetadata>;

export interface StopResult {
  port: number;
  pid: number;
  processName: string;
  signal: "SIGTERM" | "SIGKILL";
}

export interface RestartResult {
  port: number;
  previousPid: number;
  newPid: number;
  cmd: string;
  cwd: string;
}
