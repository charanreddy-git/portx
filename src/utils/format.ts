import os from "node:os";
import path from "node:path";

export const compactPath = (value: string | null): string => {
  if (!value) {
    return "unknown";
  }

  const home = os.homedir();
  if (value === home) {
    return "~";
  }

  if (value.startsWith(`${home}${path.sep}`)) {
    return `~${value.slice(home.length)}`;
  }

  return value;
};

export const cleanCommand = (value: string): string => value.replace(/\s+/g, " ").trim();

export const formatUptime = (startedAt: Date | null, now = new Date()): string => {
  if (!startedAt || Number.isNaN(startedAt.getTime())) {
    return "unknown";
  }

  const totalSeconds = Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};
