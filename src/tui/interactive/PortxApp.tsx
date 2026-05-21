import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, useApp, useInput } from "ink";
import type { ListedPortProcess, PortProcess } from "../../types/index.js";
import { toErrorMessage } from "../../utils/errors.js";
import { PortService } from "../../services/portService.js";
import { RestartService } from "../../services/restartService.js";
import { StopService } from "../../services/stopService.js";
import { Header } from "./Header.js";
import { PortList } from "./PortList.js";
import { InspectPanel } from "./InspectPanel.js";
import { HelpBar } from "./HelpBar.js";
import { NoticeBar } from "./NoticeBar.js";
import type { Notice } from "./NoticeBar.js";

type View = "list" | "inspect";

const refreshMs = 5000;

const getListSignature = (processes: ListedPortProcess[]): string =>
  processes.map((p) => `${p.port}:${p.pid}:${p.command}:${p.cwd ?? ""}`).join("|");

export const PortxApp = () => {
  const { exit } = useApp();
  const portService = useMemo(() => new PortService(), []);
  const restartService = useMemo(() => new RestartService(), []);
  const stopService = useMemo(() => new StopService(), []);
  const listSignatureRef = useRef("");

  const [view, setView] = useState<View>("list");
  const [ports, setPorts] = useState<ListedPortProcess[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inspected, setInspected] = useState<PortProcess | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const filteredPorts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ports;

    return ports.filter((p) => {
      const searchable = [String(p.port), String(p.pid), p.processName, p.projectHint, p.command, p.cwd ?? ""]
        .join(" ")
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [ports, query]);

  const selected = filteredPorts[selectedIndex] ?? null;
  const activePort = inspected?.port ?? selected?.port ?? null;
  const listCount = filteredPorts.length;
  const totalCount = ports.length;

  // --- Data fetching ---

  const refreshList = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);

      try {
        const nextPorts = await portService.listProjectPorts();
        const signature = getListSignature(nextPorts);

        if (signature !== listSignatureRef.current) {
          listSignatureRef.current = signature;
          setPorts(nextPorts);
          setSelectedIndex((i) => Math.min(i, Math.max(0, nextPorts.length - 1)));
        }

        if (!silent) setNotice(null);
      } catch (error) {
        setNotice({ tone: "error", text: toErrorMessage(error) });
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [portService]
  );

  const inspectPort = useCallback(
    async (port: number) => {
      setIsBusy(true);
      setNotice(null);

      try {
        const processInfo = await portService.inspect(port);
        setInspected(processInfo);
        setView("inspect");
      } catch (error) {
        setNotice({ tone: "error", text: toErrorMessage(error) });
      } finally {
        setIsBusy(false);
      }
    },
    [portService]
  );

  const stopPort = useCallback(
    async (port: number) => {
      setIsBusy(true);

      try {
        await restartService.rememberFromPort(port);
        const result = await stopService.stop(port);
        setNotice({ tone: "success", text: `Stopped ${result.processName} on :${port}` });
        setInspected(null);
        setView("list");
        await refreshList(true);
      } catch (error) {
        setNotice({ tone: "error", text: toErrorMessage(error) });
      } finally {
        setIsBusy(false);
      }
    },
    [refreshList, restartService, stopService]
  );

  const restartPort = useCallback(
    async (port: number) => {
      setIsBusy(true);

      try {
        const result = await restartService.restart(port);
        setNotice({ tone: "success", text: `Restarted ${result.cmd} on :${port}` });
        setInspected(null);
        setView("list");
        await refreshList(true);
      } catch (error) {
        setNotice({ tone: "error", text: toErrorMessage(error) });
      } finally {
        setIsBusy(false);
      }
    },
    [refreshList, restartService]
  );

  // --- Effects ---

  useEffect(() => {
    if (view !== "list") return;

    void refreshList(false);
    const timer = setInterval(() => void refreshList(true), refreshMs);
    return () => clearInterval(timer);
  }, [refreshList, view]);

  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(0, filteredPorts.length - 1)));
  }, [filteredPorts.length]);

  // --- Keyboard ---

  useInput((input, key) => {
    if (key.ctrl && input === "c") {
      exit();
      return;
    }

    if (isBusy) return;

    // Search mode
    if (isSearching) {
      if (key.return) {
        setIsSearching(false);
        return;
      }

      if (key.escape) {
        setIsSearching(false);
        setQuery("");
        return;
      }

      if (key.backspace || key.delete) {
        setQuery((q) => q.slice(0, -1));
        return;
      }

      if (input && !key.upArrow && !key.downArrow) {
        setQuery((q) => `${q}${input}`);
      }
      return;
    }

    // Global
    if (input === "q") {
      exit();
      return;
    }

    if (input === "/") {
      setView("list");
      setIsSearching(true);
      return;
    }

    if (key.escape) {
      if (view === "inspect") {
        setInspected(null);
        setView("list");
      }
      return;
    }

    // Inspect view
    if (view === "inspect") {
      if (input === "r" && activePort) void restartPort(activePort);
      if (input === "x" && activePort) void stopPort(activePort);
      return;
    }

    // List navigation
    if (key.upArrow || input === "k") {
      setSelectedIndex((i) => Math.max(0, i - 1));
      return;
    }

    if (key.downArrow || input === "j") {
      setSelectedIndex((i) => Math.min(filteredPorts.length - 1, i + 1));
      return;
    }

    if (input === "g") {
      setSelectedIndex(0);
      return;
    }

    if (input === "G") {
      setSelectedIndex(Math.max(0, filteredPorts.length - 1));
      return;
    }

    // List actions
    if (input === "r" && selected) {
      void restartPort(selected.port);
      return;
    }

    if (input === "x" && selected) {
      void stopPort(selected.port);
      return;
    }

    if (key.return && selected) {
      void inspectPort(selected.port);
    }
  });

  // --- Render ---

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Header
        view={view}
        isSearching={isSearching}
        query={query}
        isBusy={isBusy}
        isLoading={isLoading}
        listCount={listCount}
        totalCount={totalCount}
        activePort={activePort}
      />
      {view === "list" ? (
        <PortList ports={filteredPorts} selectedIndex={selectedIndex} isLoading={isLoading} />
      ) : null}
      {view === "inspect" ? <InspectPanel process={inspected} /> : null}
      {notice ? <NoticeBar notice={notice} /> : null}
      <HelpBar view={view} isSearching={isSearching} />
    </Box>
  );
};
