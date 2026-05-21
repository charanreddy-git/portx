export class PortxError extends Error {
  public readonly code: string;

  public constructor(message: string, code = "PORTX_ERROR") {
    super(message);
    this.name = "PortxError";
    this.code = code;
  }
}

export const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};
