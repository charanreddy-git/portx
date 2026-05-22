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
    return (
      <StatusLine
        tone="info"
        title={`Port ${port} is free`}
        detail="No listening process was found."
      />
    );
  }

  const statusColor = process.status === "running" ? theme.accentGreen : theme.danger;
  const statusLabel = process.status === "running" ? "● running" : "✖ stopped";

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={theme.accentCyan} bold>PORTX</Text>
        <Text color={theme.disabled}> › </Text>
        <Text color={theme.accentCyan}>{port}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color={theme.border}>{"─".repeat(56)}</Text>
      </Box>
      <Text color={theme.primaryText}>{cleanCommand(process.command)}</Text>
      <Box marginTop={1} flexDirection="column">
        <KeyValue label="pid" value={process.pid} />
        <KeyValue label="status" value={statusLabel} valueColor={statusColor} />
        <KeyValue label="uptime" value={formatUptime(process.startedAt)} />
        <KeyValue label="cwd" value={compactPath(process.cwd)} />
      </Box>
    </Box>
  );
};
