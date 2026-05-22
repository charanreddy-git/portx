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

  const statusColor = process.status === "running" ? theme.accentGreen : theme.danger;
  const statusLabel = process.status === "running" ? "● running" : "✖ stopped";

  return (
    <Box flexDirection="column" marginY={1} marginLeft={2}>
      <Text color={theme.border}>╭──────────────────────────────────────────╮</Text>
      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={40}>
          <Text color={theme.primaryText} bold>Process Details</Text>
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>
      <Text color={theme.border}>├──────────────────────────────────────────┤</Text>
      
      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={40}>
          <KeyValue label="PORT" value={process.port} />
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>

      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={40}>
          <KeyValue label="PID" value={process.pid} />
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>

      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={40}>
          <KeyValue label="PROCESS" value={process.processName} />
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>

      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={40}>
          <KeyValue label="COMMAND" value={cleanCommand(process.command)} />
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>

      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={40}>
          <KeyValue label="STATUS" value={statusLabel} valueColor={statusColor} />
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>

      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={40}>
          <KeyValue label="UPTIME" value={formatUptime(process.startedAt)} />
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>

      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={40}>
          <KeyValue label="DIRECTORY" value={compactPath(process.cwd)} />
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>

      <Text color={theme.border}>╰──────────────────────────────────────────╯</Text>
    </Box>
  );
};
