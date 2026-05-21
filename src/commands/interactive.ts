import React from "react";
import { PortxApp } from "../tui/interactive/PortxApp.js";
import { renderInteractive } from "../tui/render.js";

export const interactiveCommand = async (): Promise<void> => {
  await renderInteractive(React.createElement(PortxApp));
};
