import React from "react";
import { Box, Text } from "ink";
import { theme } from "./theme.js";

interface StatusLineProps {
  tone: "success" | "error" | "info" | "warning";
  title: string;
  detail?: string;
}

const toneColor = {
  success: theme.success,
  error: theme.danger,
  info: theme.secondaryText,
  warning: theme.warning,
} as const;

export const StatusLine = ({ tone, title, detail }: StatusLineProps) => (
  <Box flexDirection="column" paddingX={1} marginY={1}>
    <Box>
      <Text color={toneColor[tone]}>●</Text>
      <Text>  </Text>
      <Text color={theme.primaryText}>{title}</Text>
    </Box>
    {detail ? (
      <Box marginTop={1}>
        <Text color={theme.secondaryText}>{detail}</Text>
      </Box>
    ) : null}
  </Box>
);
