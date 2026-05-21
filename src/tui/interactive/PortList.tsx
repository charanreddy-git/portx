import React from "react";
import { Box, Text } from "ink";
import type { ListedPortProcess } from "../../types/index.js";
import { compactPath } from "../../utils/format.js";
import { theme } from "../theme.js";

interface PortListProps {
  ports: ListedPortProcess[];
  selectedIndex: number;
  isLoading: boolean;
}

const pageSize = 12;

const columns = {
  marker: 3,
  port: 7,
  pid: 8,
  process: 16,
  project: 18
} as const;

const ColumnHeaders = () => (
  <Box marginBottom={1}>
    <Box width={columns.marker}>
      <Text> </Text>
    </Box>
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
);

const PortRow = ({ process, isSelected }: { process: ListedPortProcess; isSelected: boolean }) => (
  <Box>
    <Box width={columns.marker}>
      <Text color={isSelected ? theme.green : ""}>{isSelected ? " ▸" : "  "}</Text>
    </Box>
    <Box width={columns.port}>
      <Text color={isSelected ? theme.cyan : theme.text}>{process.port}</Text>
    </Box>
    <Box width={columns.pid}>
      <Text color={isSelected ? theme.text : theme.muted}>{process.pid}</Text>
    </Box>
    <Box width={columns.process}>
      <Text color={isSelected ? theme.text : theme.muted}>{process.processName}</Text>
    </Box>
    <Box width={columns.project}>
      <Text color={isSelected ? theme.text : theme.muted}>{process.projectHint}</Text>
    </Box>
    <Text color={isSelected ? theme.text : theme.dim}>{compactPath(process.cwd)}</Text>
  </Box>
);

export const PortList = ({ ports, selectedIndex, isLoading }: PortListProps) => {
  if (isLoading && ports.length === 0) {
    return (
      <Box flexDirection="column">
        <ColumnHeaders />
        <Box>
          <Text color={theme.muted}>Scanning…</Text>
        </Box>
      </Box>
    );
  }

  if (ports.length === 0) {
    return (
      <Box flexDirection="column">
        <ColumnHeaders />
        <Box marginTop={1}>
          <Text color={theme.text}>No ports found</Text>
        </Box>
        <Box marginTop={1}>
          <Text color={theme.muted}>System services and low ports are hidden.</Text>
        </Box>
      </Box>
    );
  }

  const startIndex = Math.max(
    0,
    Math.min(selectedIndex - Math.floor(pageSize / 2), Math.max(0, ports.length - pageSize))
  );
  const endIndex = Math.min(startIndex + pageSize, ports.length);
  const visiblePorts = ports.slice(startIndex, endIndex);

  return (
    <Box flexDirection="column">
      <ColumnHeaders />
      {visiblePorts.map((process, index) => (
        <PortRow
          key={`${process.pid}:${process.port}`}
          process={process}
          isSelected={startIndex + index === selectedIndex}
        />
      ))}
      {ports.length > pageSize ? (
        <Box marginTop={1}>
          <Text color={theme.muted}>
            {startIndex + 1}–{endIndex} of {ports.length}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};
