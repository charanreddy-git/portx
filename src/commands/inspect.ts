import React from "react";
import { InspectView } from "../tui/InspectView.js";
import { renderOnce } from "../tui/render.js";
import { parsePort } from "../utils/ports.js";
import { PortService } from "../services/portService.js";
import { RestartService } from "../services/restartService.js";

export const inspectCommand = async (portValue: string): Promise<void> => {
  const port = parsePort(portValue);
  const portService = new PortService();
  const restartService = new RestartService();
  const processInfo = await portService.inspect(port);

  if (processInfo) {
    await restartService.rememberFromPort(port);
  }

  await renderOnce(React.createElement(InspectView, { process: processInfo, port }));
};
