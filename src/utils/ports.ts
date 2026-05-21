import { PortxError } from "./errors.js";

export const parsePort = (value: string): number => {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new PortxError(`"${value}" is not a valid TCP port. Use a number from 1 to 65535.`, "INVALID_PORT");
  }

  return port;
};
