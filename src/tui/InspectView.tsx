import React from "react";
import { Box, Text } from "ink";
import type { PortProcess } from "../types/index.js";
import { cleanCommand, compactPath, formatUptime } from "../utils/format.js";
import { KeyValue } from "./KeyValue.js";
import { StatusLine } from "./StatusLine.js";
import { theme } from "./theme.js";

interface InspectViewProps {
  process: PortProcess | null;
  port: number;
}

export const InspectView = ({ process, port }: InspectViewProps) => {
  if (!process) {
    return <StatusLine tone="info" title={`Port ${port} is free`} detail="No listening process was found." />;
  }

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={theme.green}>portx</Text>
        <Text color={theme.dim}> › </Text>
        <Text color={theme.cyan}>{port}</Text>
      </Box>
      <Text color={theme.bright}>{cleanCommand(process.command)}</Text>
      <Box marginTop={1} flexDirection="column">
        <KeyValue label="pid" value={process.pid} />
        <KeyValue
          label="status"
          value={process.status}
          valueColor={process.status === "running" ? theme.green : theme.cyan}
        />
        <KeyValue label="uptime" value={formatUptime(process.startedAt)} />
        <KeyValue label="cwd" value={compactPath(process.cwd)} />
      </Box>
    </Box>
  );
};
