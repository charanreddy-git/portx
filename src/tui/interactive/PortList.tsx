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
  port: 8,
  process: 14,
  project: 16,
  status: 12,
} as const;

const ColumnHeaders = () => (
  <Box marginBottom={1}>
    <Box width={columns.marker}>
      <Text> </Text>
    </Box>
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
);

const StatusBadge = ({ status }: { status: string }) => {
  const color = status === "running" ? theme.running : theme.stopped;
  return <Text color={color}>{status}</Text>;
};

const PortRow = ({
  process,
  isSelected,
}: {
  process: ListedPortProcess;
  isSelected: boolean;
}) => (
  <Box>
    <Box width={columns.marker}>
      <Text color={isSelected ? theme.cyan : ""}>{isSelected ? " ▶" : "  "}</Text>
    </Box>
    <Box width={columns.port}>
      <Text color={isSelected ? theme.cyan : theme.primary}>{process.port}</Text>
    </Box>
    <Box width={columns.process}>
      <Text color={isSelected ? theme.primary : theme.secondary}>
        {process.processName}
      </Text>
    </Box>
    <Box width={columns.project}>
      <Text color={isSelected ? theme.primary : theme.secondary}>
        {process.projectHint}
      </Text>
    </Box>
    <Box width={columns.status}>
      <StatusBadge status={process.status} />
    </Box>
    <Text color={isSelected ? theme.secondary : theme.dimmed}>
      {compactPath(process.cwd)}
    </Text>
  </Box>
);

export const PortList = ({ ports, selectedIndex, isLoading }: PortListProps) => {
  if (isLoading && ports.length === 0) {
    return (
      <Box flexDirection="column" marginTop={1}>
        <ColumnHeaders />
        <Box>
          <Text color={theme.dimmed}>  Scanning…</Text>
        </Box>
      </Box>
    );
  }

  if (ports.length === 0) {
    return (
      <Box flexDirection="column" marginTop={1}>
        <ColumnHeaders />
        <Box marginTop={1}>
          <Text color={theme.secondary}>  No ports found</Text>
        </Box>
        <Box marginTop={1}>
          <Text color={theme.dimmed}>  System services and low ports are hidden.</Text>
        </Box>
      </Box>
    );
  }

  const startIndex = Math.max(
    0,
    Math.min(
      selectedIndex - Math.floor(pageSize / 2),
      Math.max(0, ports.length - pageSize)
    )
  );
  const endIndex = Math.min(startIndex + pageSize, ports.length);
  const visiblePorts = ports.slice(startIndex, endIndex);

  return (
    <Box flexDirection="column" marginTop={1}>
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
          <Text color={theme.dimmed}>
            {"  "}
            {startIndex + 1}–{endIndex} of {ports.length}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};
