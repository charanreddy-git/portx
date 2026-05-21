import React from "react";
import type { RestartResult } from "../types/index.js";
import { compactPath } from "../utils/format.js";
import { StatusLine } from "./StatusLine.js";

interface RestartViewProps {
  result: RestartResult;
}

export const RestartView = ({ result }: RestartViewProps) => (
  <StatusLine
    tone="success"
    title={`Restarted port ${result.port}`}
    detail={`${result.cmd} in ${compactPath(result.cwd)} (PID ${result.previousPid} -> ${result.newPid}).`}
  />
);
