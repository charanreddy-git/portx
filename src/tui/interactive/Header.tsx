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
  activePort
}: HeaderProps) => {
  let right = "";
  let rightColor: string = theme.muted;

  if (isSearching) {
    right = `/${query || "…"}`;
    rightColor = theme.green;
  } else if (isBusy) {
    right = "working…";
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
    <Box marginBottom={1} justifyContent="space-between">
      <Box>
        <Text color={theme.green}>portx</Text>
        {view === "inspect" && activePort ? (
          <>
            <Text color={theme.dim}> › </Text>
            <Text color={theme.cyan}>{activePort}</Text>
          </>
        ) : null}
      </Box>
      {right ? <Text color={rightColor}>{right}</Text> : null}
    </Box>
  );
};
