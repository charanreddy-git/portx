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
  let rightElement = null;

  if (isSearching) {
    rightElement = (
      <Box>
        <Text color={theme.secondaryText}>Search: </Text>
        <Text color={theme.accentCyan} backgroundColor={theme.selected}>{query || " "}</Text>
        <Text color={theme.accentCyan}>█</Text>
      </Box>
    );
  } else {
    let rightText = "";
    let rightColor: string = theme.dimmed;

    if (isBusy) {
      rightText = "working…";
      rightColor = theme.warning;
    } else if (isLoading) {
      rightText = "scanning…";
    } else if (view === "list") {
      if (totalCount > 0) {
        rightText = listCount === totalCount ? `${listCount}` : `${listCount}/${totalCount}`;
      }
    }

    if (rightText) {
      rightElement = <Text color={rightColor}>{rightText}</Text>;
    }
  }

  return (
    <Box flexDirection="column">
      <Box justifyContent="space-between">
        <Box>
          <Text color={theme.accentCyan} bold>PORTX</Text>
          {view === "inspect" && activePort ? (
            <>
              <Text color={theme.disabled}> › </Text>
              <Text color={theme.accentCyan}>{activePort}</Text>
            </>
          ) : null}
        </Box>
        {rightElement}
      </Box>
      <Text color={theme.dimmed}>Local Development Port Manager</Text>
      <Box marginTop={1}>
        <Text color={theme.border}>{"─".repeat(56)}</Text>
      </Box>
    </Box>
  );
};
