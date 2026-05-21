import React from "react";
import { Box, Text } from "ink";
import { theme } from "./theme.js";

interface KeyValueProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

const labelWidth = 10;

export const KeyValue = ({ label, value, valueColor }: KeyValueProps) => (
  <Box>
    <Box width={labelWidth}>
      <Text color={theme.muted}>{label}</Text>
    </Box>
    <Text color={valueColor ?? theme.text}>{value}</Text>
  </Box>
);
