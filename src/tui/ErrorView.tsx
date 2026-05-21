import React from "react";
import { StatusLine } from "./StatusLine.js";

interface ErrorViewProps {
  message: string;
}

export const ErrorView = ({ message }: ErrorViewProps) => <StatusLine tone="error" title="Portx failed" detail={message} />;
