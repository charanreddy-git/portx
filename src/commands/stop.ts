import React from "react";
import { StopView } from "../tui/StopView.js";
import { renderOnce } from "../tui/render.js";
import { RestartService } from "../services/restartService.js";
import { StopService } from "../services/stopService.js";
import { parsePort } from "../utils/ports.js";

export const stopCommand = async (portValue: string): Promise<void> => {
  const port = parsePort(portValue);
  const restartService = new RestartService();
  await restartService.rememberFromPort(port);

  const result = await new StopService().stop(port);
  await renderOnce(React.createElement(StopView, { result }));
};
