#!/bin/bash

# Portx — Frictionless Installer
# A premium, minimal macOS-first utility for developer port management.

set -e

# Term colors
GREEN="\033[38;2;105;219;124m"
CYAN="\033[38;2;95;179;179m"
DIM="\033[90m"
BOLD="\033[1m"
RED="\033[31m"
RESET="\033[0m"

echo -e "${GREEN}${BOLD}portx ›${RESET} initializing installation...\n"

# 1. Environment & OS Verification
OS="$(uname)"
if [ "$OS" != "Darwin" ]; then
    echo -e "${RED}Warning:${RESET} Portx utilizes macOS-native utilities (lsof, ps)."
    echo -e "         Running on $OS might result in degraded functionality.\n"
    read -p "Do you want to continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "\nInstallation aborted."
        exit 1
    fi
fi

# 2. Prerequisites Verification
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}Error:${RESET} Node.js is required but could not be found."
    echo -e "       Please install Node.js (version 20 or higher) and try again."
    echo -e "       Visit https://nodejs.org or run 'brew install node' on macOS."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)

if [ "$NODE_MAJOR" -lt 20 ]; then
    echo -e "${RED}Warning:${RESET} Node.js version $NODE_VERSION detected."
    echo -e "         Portx requires Node.js >= 20.0.0. You may experience compatibility issues."
    echo
fi

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}Error:${RESET} npm is required but could not be found."
    exit 1
fi

# 3. Installing Portx Globally
echo -e "${DIM}package › installing portx globally via npm...${RESET}"

# Check if npm global directory is writable without sudo
if [ -w "$(npm config get prefix)/lib/node_modules" ] 2>/dev/null || [ -w "$(npm config get prefix)" ] 2>/dev/null; then
    npm install -g portx
else
    echo -e "${DIM}access › global folder requires administrator privileges. running with sudo...${RESET}"
    sudo npm install -g portx
fi

echo -e "\n${GREEN}✓ Installation complete!${RESET}"
echo -e "----------------------------------------"
echo -e "To launch the interactive TUI, run:"
echo -e "  ${CYAN}${BOLD}portx${RESET}"
echo -e ""
echo -e "To list active ports directly, run:"
echo -e "  ${CYAN}${BOLD}portx list${RESET}"
echo -e "----------------------------------------"
