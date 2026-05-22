import React from "react";
import { Box, Text } from "ink";
import type { PortProcess } from "../../types/index.js";
import { cleanCommand, compactPath, formatUptime } from "../../utils/format.js";
import { KeyValue } from "../KeyValue.js";
import { theme } from "../theme.js";

interface InspectPanelProps {
  process: PortProcess | null;
}

export const InspectPanel = ({ process }: InspectPanelProps) => {
  if (!process) {
    return (
      <Box marginY={1}>
        <Text color={theme.dimmed}>  This port is no longer listening.</Text>
      </Box>
    );
  }

  const statusColor = process.status === "running" ? theme.running : theme.stopped;

  return (
    <Box flexDirection="column" marginY={1}>
      <Text color={theme.primary}>{cleanCommand(process.command)}</Text>
      <Box marginTop={1} flexDirection="column">
        <KeyValue label="pid" value={process.pid} />
        <KeyValue label="status" value={process.status} valueColor={statusColor} />
        <KeyValue label="uptime" value={formatUptime(process.startedAt)} />
        <KeyValue label="cwd" value={compactPath(process.cwd)} />
      </Box>
    </Box>
  );
};
