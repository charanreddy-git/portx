import React from "react";
import { Box, Text } from "ink";
import { theme } from "./theme.js";

interface KeyValueProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

const labelWidth = 12;

export const KeyValue = ({ label, value, valueColor }: KeyValueProps) => (
  <Box>
    <Box width={labelWidth}>
      <Text color={theme.dimmed}>{label}</Text>
    </Box>
    <Text color={valueColor ?? theme.primary}>{value}</Text>
  </Box>
);
