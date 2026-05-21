import React from "react";
import { render } from "ink";

export const renderOnce = async (node: React.ReactElement): Promise<void> => {
  const instance = render(node, {
    exitOnCtrlC: false
  });

  await new Promise((resolve) => setTimeout(resolve, 10));
  instance.unmount();
};

export const renderInteractive = async (node: React.ReactElement): Promise<void> => {
  process.stdout.write("\x1b[2J\x1b[3J\x1b[H\x1b[?25l");

  const instance = render(node, {
    exitOnCtrlC: true
  });

  try {
    await instance.waitUntilExit();
  } finally {
    process.stdout.write("\x1b[?25h");
  }
};
