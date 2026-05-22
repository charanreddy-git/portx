import React from "react";
import { Box, Text } from "ink";
import { theme } from "../theme.js";

type NoticeTone = "info" | "success" | "error";

export interface Notice {
  tone: NoticeTone;
  text: string;
}

const toneColor = {
  info: theme.accentCyan,
  success: theme.success,
  error: theme.danger,
} as const;

export const NoticeBar = ({ notice }: { notice: Notice }) => (
  <Box marginTop={1}>
    <Text color={toneColor[notice.tone]}>●</Text>
    <Text>  </Text>
    <Text color={theme.primaryText}>{notice.text}</Text>
  </Box>
);
