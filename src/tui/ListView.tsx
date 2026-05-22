import React from "react";
import { Box, Text } from "ink";
import type { ListedPortProcess } from "../types/index.js";
import { compactPath } from "../utils/format.js";
import { StatusLine } from "./StatusLine.js";
import { theme } from "./theme.js";

interface ListViewProps {
  processes: ListedPortProcess[];
}

const columns = {
  port: 8,
  process: 14,
  project: 16,
  status: 12,
} as const;

const Row = ({ process }: { process: ListedPortProcess }) => (
  <Box>
    <Box width={columns.port}>
      <Text color={theme.accentCyan}>{process.port}</Text>
    </Box>
    <Box width={columns.process}>
      <Text color={theme.secondaryText}>{process.processName}</Text>
    </Box>
    <Box width={columns.project}>
      <Text color={theme.secondaryText}>{process.projectHint}</Text>
    </Box>
    <Box width={columns.status}>
      <Text color={process.status === "running" ? theme.accentGreen : theme.danger}>
        {process.status === "running" ? "● running" : "✖ stopped"}
      </Text>
    </Box>
    <Text color={theme.dimmed}>{compactPath(process.cwd)}</Text>
  </Box>
);

export const ListView = ({ processes }: ListViewProps) => {
  if (processes.length === 0) {
    return (
      <StatusLine
        tone="info"
        title="✓ No active development ports found"
        detail="Start your local app and Portx will detect it automatically."
      />
    );
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={theme.accentCyan} bold>PORTX</Text>
        <Text color={theme.dimmed}> list</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color={theme.border}>{"─".repeat(56)}</Text>
      </Box>
      <Box marginBottom={1}>
        <Box width={columns.port}>
          <Text color={theme.disabled}>PORT</Text>
        </Box>
        <Box width={columns.process}>
          <Text color={theme.disabled}>PROCESS</Text>
        </Box>
        <Box width={columns.project}>
          <Text color={theme.disabled}>PROJECT</Text>
        </Box>
        <Box width={columns.status}>
          <Text color={theme.disabled}>STATUS</Text>
        </Box>
        <Text color={theme.disabled}>PATH</Text>
      </Box>
      {processes.map((process) => (
        <Row key={`${process.pid}:${process.port}`} process={process} />
      ))}
    </Box>
  );
};
