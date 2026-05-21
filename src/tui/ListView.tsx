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
  port: 7,
  pid: 8,
  process: 16,
  project: 18
} as const;

const Row = ({ process }: { process: ListedPortProcess }) => (
  <Box>
    <Box width={columns.port}>
      <Text color={theme.cyan}>{process.port}</Text>
    </Box>
    <Box width={columns.pid}>
      <Text color={theme.muted}>{process.pid}</Text>
    </Box>
    <Box width={columns.process}>
      <Text color={theme.text}>{process.processName}</Text>
    </Box>
    <Box width={columns.project}>
      <Text color={theme.muted}>{process.projectHint}</Text>
    </Box>
    <Text color={theme.dim}>{compactPath(process.cwd)}</Text>
  </Box>
);

export const ListView = ({ processes }: ListViewProps) => {
  if (processes.length === 0) {
    return (
      <StatusLine
        tone="info"
        title="No project ports found"
        detail="System services and low ports are hidden."
      />
    );
  }

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Box marginBottom={1}>
        <Text color={theme.green}>portx</Text>
      </Box>
      <Box marginBottom={1}>
        <Box width={columns.port}>
          <Text color={theme.muted}>port</Text>
        </Box>
        <Box width={columns.pid}>
          <Text color={theme.muted}>pid</Text>
        </Box>
        <Box width={columns.process}>
          <Text color={theme.muted}>process</Text>
        </Box>
        <Box width={columns.project}>
          <Text color={theme.muted}>project</Text>
        </Box>
        <Text color={theme.muted}>path</Text>
      </Box>
      {processes.map((process) => (
        <Row key={`${process.pid}:${process.port}`} process={process} />
      ))}
    </Box>
  );
};
