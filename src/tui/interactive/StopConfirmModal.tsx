import React from "react";
import { Box, Text } from "ink";
import type { ListedPortProcess, PortProcess } from "../../types/index.js";
import { theme } from "../theme.js";

interface StopConfirmModalProps {
  process: ListedPortProcess | PortProcess;
}

export const StopConfirmModal = ({ process }: StopConfirmModalProps) => {
  const isListed = "projectHint" in process;
  const subtitle = isListed
    ? `${process.processName} • ${process.projectHint}`
    : process.processName;

  return (
    <Box flexDirection="column" marginY={1} marginLeft={2}>
      <Text color={theme.border}>╭──────────────────────────────╮</Text>
      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={28}>
          <Text color={theme.primaryText}>Stop process on port {process.port}?</Text>
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>
      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={28}>
          <Text> </Text>
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>
      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={28}>
          <Text color={theme.danger}>{subtitle}</Text>
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>
      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={28}>
          <Text> </Text>
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>
      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={28}>
          <Text color={theme.secondaryText}>[⏎] Confirm</Text>
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>
      <Box>
        <Text color={theme.border}>│ </Text>
        <Box width={28}>
          <Text color={theme.secondaryText}>[⎋] Cancel</Text>
        </Box>
        <Text color={theme.border}> │</Text>
      </Box>
      <Text color={theme.border}>╰──────────────────────────────╯</Text>
    </Box>
  );
};
