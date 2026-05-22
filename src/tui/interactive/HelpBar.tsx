import React from "react";
import { Box, Text } from "ink";
import { theme } from "../theme.js";

interface HelpBarProps {
  view: "list" | "inspect";
  isSearching: boolean;
}

const Hint = ({ keys, action }: { keys: string; action: string }) => (
  <Box marginRight={2}>
    <Text color={theme.accentCyan}>[{keys}]</Text>
    <Text color={theme.secondaryText}> {action}</Text>
  </Box>
);

export const HelpBar = ({ view, isSearching }: HelpBarProps) => {
  if (isSearching) {
    return (
      <Box flexDirection="column">
        <Box>
          <Text color={theme.border}>{"─".repeat(56)}</Text>
        </Box>
        <Box marginTop={1}>
          <Hint keys="type" action="filter" />
          <Hint keys="enter" action="done" />
          <Hint keys="esc" action="clear" />
        </Box>
      </Box>
    );
  }

  if (view === "inspect") {
    return (
      <Box flexDirection="column">
        <Box>
          <Text color={theme.border}>{"─".repeat(56)}</Text>
        </Box>
        <Box marginTop={1}>
          <Hint keys="r" action="restart" />
          <Hint keys="x" action="stop" />
          <Hint keys="esc" action="back" />
          <Hint keys="q" action="quit" />
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={theme.border}>{"─".repeat(56)}</Text>
      </Box>
      <Box marginTop={1}>
        <Hint keys="j/k" action="move" />
        <Hint keys="enter" action="inspect" />
        <Hint keys="x" action="stop" />
        <Hint keys="r" action="restart" />
        <Hint keys="/" action="search" />
        <Hint keys="q" action="quit" />
      </Box>
    </Box>
  );
};
