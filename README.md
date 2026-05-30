# Portx

macOS-first CLI to list, inspect, stop, and restart local processes bound to ports.

## Requirements

- macOS
- Node.js >= 20

## Install (from source)

```bash
git clone https://github.com/charan/portx.git
cd portx
npm install
npm run build
npm link
```

## Run

```bash
portx
```

## Commands

```bash
portx list
portx inspect <port>
portx stop <port>
portx restart <port>
```

## Config

Restart metadata: `~/.portx/store.json`

```bash
PORTX_HOME=~/.portx-test portx restart 3000
```

## License

MIT
