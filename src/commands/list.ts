import React from "react";
import { PortService } from "../services/portService.js";
import { ListView } from "../tui/ListView.js";
import { renderOnce } from "../tui/render.js";

export const listCommand = async (): Promise<void> => {
  const processes = await new PortService().listProjectPorts();
  await renderOnce(React.createElement(ListView, { processes }));
};
