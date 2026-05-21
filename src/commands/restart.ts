import React from "react";
import { RestartView } from "../tui/RestartView.js";
import { renderOnce } from "../tui/render.js";
import { RestartService } from "../services/restartService.js";
import { parsePort } from "../utils/ports.js";

export const restartCommand = async (portValue: string): Promise<void> => {
  const port = parsePort(portValue);
  const result = await new RestartService().restart(port);
  await renderOnce(React.createElement(RestartView, { result }));
};
