import React from "react";
import { Box, Text } from "ink";
import { theme } from "../theme.js";

interface HeaderProps {
  view: "list" | "inspect";
  isSearching: boolean;
  query: string;
  isBusy: boolean;
  isLoading: boolean;
  listCount: number;
  totalCount: number;
  activePort: number | null;
}

export const Header = ({
  view,
  isSearching,
  query,
  isBusy,
  isLoading,
  listCount,
  totalCount,
  activePort,
}: HeaderProps) => {
  let right = "";
  let rightColor: string = theme.dimmed;

  if (isSearching) {
    right = `/${query || "…"}`;
    rightColor = theme.search;
  } else if (isBusy) {
    right = "working…";
    rightColor = theme.warning;
  } else if (isLoading) {
    right = "scanning…";
  } else if (view === "list") {
    if (totalCount === 0) {
      right = "";
    } else if (listCount === totalCount) {
      right = `${listCount}`;
    } else {
      right = `${listCount}/${totalCount}`;
    }
  }

  return (
    <Box flexDirection="column">
      <Box justifyContent="space-between">
        <Box>
          <Text color={theme.cyan} bold>PORTX</Text>
          {view === "inspect" && activePort ? (
            <>
              <Text color={theme.disabled}> › </Text>
              <Text color={theme.mutedCyan}>{activePort}</Text>
            </>
          ) : null}
        </Box>
        {right ? <Text color={rightColor}>{right}</Text> : null}
      </Box>
      <Text color={theme.dimmed}>Local Development Port Manager</Text>
      <Box marginTop={1}>
        <Text color={theme.border}>{"─".repeat(56)}</Text>
      </Box>
    </Box>
  );
};
