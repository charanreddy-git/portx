#!/usr/bin/env node
import React from "react";
import { Command } from "commander";
import { inspectCommand } from "./commands/inspect.js";
import { interactiveCommand } from "./commands/interactive.js";
import { listCommand } from "./commands/list.js";
import { restartCommand } from "./commands/restart.js";
import { stopCommand } from "./commands/stop.js";
import { ErrorView } from "./tui/ErrorView.js";
import { renderOnce } from "./tui/render.js";
import { toErrorMessage } from "./utils/errors.js";

const program = new Command();

const run = (action: (port: string) => Promise<void>) => {
  return async (port: string): Promise<void> => {
    try {
      await action(port);
    } catch (error) {
      await renderOnce(React.createElement(ErrorView, { message: toErrorMessage(error) }));
      process.exitCode = 1;
    }
  };
};

const runWithoutArgs = (action: () => Promise<void>) => {
  return async (): Promise<void> => {
    try {
      await action();
    } catch (error) {
      await renderOnce(React.createElement(ErrorView, { message: toErrorMessage(error) }));
      process.exitCode = 1;
    }
  };
};

program
  .name("portx")
  .description("List, inspect, stop, and restart processes running on local ports.")
  .version("0.1.0")
  .action(runWithoutArgs(interactiveCommand));

program
  .command("list")
  .description("List project-like local port processes")
  .action(runWithoutArgs(listCommand));

program
  .command("inspect")
  .argument("<port>", "local TCP port to inspect")
  .description("Show the process listening on a local port")
  .action(run(inspectCommand));

program
  .command("stop")
  .argument("<port>", "local TCP port to stop")
  .description("Stop the process listening on a local port")
  .action(run(stopCommand));

program
  .command("restart")
  .argument("<port>", "local TCP port to restart")
  .description("Restart a previously inspected or stopped port process")
  .action(run(restartCommand));

await program.parseAsync();
