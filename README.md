# Portx

A lightweight, developer-first command-line utility for macOS to inspect, stop, and restart processes running on local ports.

Designed with minimalism and keyboard ergonomics in mind, Portx filters out macOS system noise to display only your project-specific development ports in a clean, aesthetic terminal interface.

---

## Features

- **Zero-Daemon Architecture** — No background processes, no extra battery drain, no resource-heavy monitoring.
- **Minimalist Design** — Clean layout, elegant spacing, and cohesive green-and-cyan terminal theme.
- **Keyboard-First TUI** — Move quickly with standard keybindings, jump, search, inspect, stop, and restart without reaching for your mouse.
- **Intelligent Filtering** — Automatically hides low system ports and common macOS system services, highlighting your actual projects.
- **Smart Process Restarting** — Remembers the working directory and command used to start your dev processes, allowing one-key restarts even after a process is terminated.

---

## Prerequisites and Installation

Portx is designed specifically for macOS and requires Node.js.

### Prerequisites

- **OS:** macOS (utilizes native `lsof` and `ps` utilities)
- **Runtime:** Node.js `>= 20.0.0`

### One-Line Install (Recommended)

Install Portx instantly via curl:

```bash
curl -fsSL https://raw.githubusercontent.com/charan/portx/main/install.sh | bash
```

### Global Installation (NPM)

Install Portx globally via npm to make the command available system-wide:

```bash
npm install -g portx
```

### Instant Execution (NPX)

Run Portx instantly without a global installation:

```bash
npx portx
```

### Building From Source

If you want to install or run Portx locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/charan/portx.git
   cd portx
   ```

2. Install dependencies and build the TypeScript project:
   ```bash
   npm install
   npm run build
   ```

3. Link the package globally to your system:
   ```bash
   npm link
   ```

---

## Quick Start

Launch the interactive Terminal User Interface (TUI) simply by running:

```bash
portx
```

### Keyboard Shortcuts in TUI

When inside the interactive interface, use the following keys for navigation and process control:

| Key | Action | Description |
| :--- | :--- | :--- |
| `j` / `k` or `↓` / `↑` | **Navigate** | Move cursor up and down the port list. |
| `Enter` | **Inspect** | View comprehensive details about the selected port process. |
| `x` | **Stop** | Gracefully terminate the selected process (sends SIGTERM, falls back to SIGKILL). |
| `r` | **Restart** | Restart the selected process using the cached command and workspace path. |
| `/` | **Search** | Instantly filter active ports by name, port number, or directory path. |
| `g` | **Top** | Jump directly to the top of the port list. |
| `G` | **Bottom** | Jump directly to the bottom of the port list. |
| `Esc` | **Back** | Clear active search filter, or exit detail/confirmation views. |
| `q` | **Quit** | Exit Portx immediately. |

---

## CLI Commands

Portx can also be run in non-interactive mode using specific subcommands.

### 1. Show Project Ports
List active development-related listener processes.

```bash
portx list
```

*Example output:*
```text
Portx list
PORT     PID      PROCESS         PROJECT                 DIRECTORY
3000     8211     node            my-frontend             ~/projects/my-frontend
5173     9034     node            admin-dashboard         ~/work/admin-dashboard
```

### 2. Inspect a Port
Inspect full details of a process listening on a specific port.

```bash
portx inspect <port>
```

*Example:*
```bash
portx inspect 3000
```
```text
Portx inspect
PORT       3000
PID        8211
PROCESS    node
COMMAND    npm run dev
DIRECTORY  /Users/charan/projects/my-frontend
STATUS     running
```

### 3. Stop a Port Process
Gracefully stops the process running on the specified port.

```bash
portx stop <port>
```

### 4. Restart a Port Process
Restarts the process running on the specified port using stored metadata from when it was inspected/managed.

```bash
portx restart <port>
```

---

## Configuration and Mechanics

### How Port Filtering Works

Portx avoids visual noise by skipping:
- Low port numbers (typically < 1024) unless they are actively recognized as user dev processes.
- Standard macOS system listeners and background services.
- Processes running outside your user home directory structure (unless explicitly run as dev runtimes).

It prioritizes and displays processes that:
- Use known development runtimes (e.g., node, npm, pnpm, vite, next, python, rails, go, docker-proxy).
- Run inside subdirectory hierarchies of your user directory.

### Metadata Storage

Portx stores process restart commands locally in a lightweight JSON database file. This file tracks the exact command, environment configuration, and working directory associated with active ports, allowing it to recreate them correctly on restart.

- **Storage Location:** `~/.portx/store.json`

For development or continuous integration environments, you can redirect the metadata storage location by specifying the `PORTX_HOME` environment variable:

```bash
PORTX_HOME=~/.portx-test portx restart 3000
```

---

## License

This project is licensed under the MIT License.
