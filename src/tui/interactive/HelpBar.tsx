import React from "react";
import { Box, Text } from "ink";
import { theme } from "../theme.js";

interface HelpBarProps {
  view: "list" | "inspect";
  isSearching: boolean;
}

const Hint = ({ keys, action }: { keys: string; action: string }) => (
  <>
    <Text color={theme.cyan}>{keys}</Text>
    <Text color={theme.secondary}> {action}</Text>
  </>
);

const Sep = () => <Text color={theme.disabled}>  │  </Text>;

export const HelpBar = ({ view, isSearching }: HelpBarProps) => {
  if (isSearching) {
    return (
      <Box flexDirection="column">
        <Box>
          <Text color={theme.border}>{"─".repeat(56)}</Text>
        </Box>
        <Box marginTop={1}>
          <Hint keys="type" action="filter" />
          <Sep />
          <Hint keys="↵" action="done" />
          <Sep />
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
          <Sep />
          <Hint keys="x" action="stop" />
          <Sep />
          <Hint keys="esc" action="back" />
          <Sep />
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
        <Sep />
        <Hint keys="↵" action="open" />
        <Sep />
        <Hint keys="x" action="stop" />
        <Sep />
        <Hint keys="r" action="restart" />
        <Sep />
        <Hint keys="/" action="find" />
        <Sep />
        <Hint keys="q" action="quit" />
      </Box>
    </Box>
  );
};
