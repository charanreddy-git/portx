import React from "react";
import type { StopResult } from "../types/index.js";
import { StatusLine } from "./StatusLine.js";

interface StopViewProps {
  result: StopResult;
}

export const StopView = ({ result }: StopViewProps) => (
  <StatusLine
    tone="success"
    title={`Stopped port ${result.port}`}
    detail={`${result.processName} (PID ${result.pid}) exited via ${result.signal}.`}
  />
);
