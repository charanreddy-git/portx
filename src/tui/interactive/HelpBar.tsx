import React from "react";
import { Box, Text } from "ink";
import { theme } from "../theme.js";

interface HelpBarProps {
  view: "list" | "inspect";
  isSearching: boolean;
}

const Hint = ({ keys, action }: { keys: string; action: string }) => (
  <>
    <Text color={theme.text}>{keys}</Text>
    <Text color={theme.dim}> {action}  </Text>
  </>
);

export const HelpBar = ({ view, isSearching }: HelpBarProps) => {
  if (isSearching) {
    return (
      <Box marginTop={1}>
        <Hint keys="type" action="filter" />
        <Hint keys="enter" action="done" />
        <Hint keys="esc" action="clear" />
        <Hint keys="q" action="quit" />
      </Box>
    );
  }

  if (view === "inspect") {
    return (
      <Box marginTop={1}>
        <Hint keys="r" action="restart" />
        <Hint keys="x" action="stop" />
        <Hint keys="esc" action="back" />
        <Hint keys="q" action="quit" />
      </Box>
    );
  }

  return (
    <Box marginTop={1}>
      <Hint keys="j/k" action="move" />
      <Hint keys="↵" action="open" />
      <Hint keys="x" action="stop" />
      <Hint keys="r" action="restart" />
      <Hint keys="/" action="find" />
      <Hint keys="q" action="quit" />
    </Box>
  );
};
