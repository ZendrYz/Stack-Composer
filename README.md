# Stack Composer

> Scaffold modern web projects — fast, clean, complete.

A professional CLI tool that combines **interactive menus**, **flag-based workflows**, and **AI-agent compatibility** to create fully-configured projects in seconds.

## Features

- **Beautiful interactive UI** — Elegant prompts with Figlet banners, Chalk colors, and Ora spinners
- **6 curated stacks** — Next.js Full, Next.js + Shadcn, Astro, TanStack Start, Vite + React, SvelteKit
- **Ultra-fast mode** — `--yes` flag to accept all defaults
- **AI-agent friendly** — `--json` flag for structured output
- **Hyper-optimized binary** — Minified and lightweight (~16KB) for instant execution
- **Smart flag merging** — Flags fill in values, prompts ask only what's missing
- **Zero-config Tailwind** — Auto-configures VS Code to suppress `Unknown at rule` warnings
- **Multi-PM support** — pnpm (default), npm, or yarn

## Installation

For the fastest possible experience (zero network latency), install it globally:

```bash
npm install -g stack-composer
```

Now you can just type:

```bash
stack-composer create
```

## Usage Modes

### Interactive Mode (default)

```bash
stack-composer create
```

Launches a beautiful interactive menu where you pick your stack, name, and options.

### Flag Mode

```bash
stack-composer create next-full my-app --tailwind --eslint --git
```

Specify values via flags. Missing values will be prompted interactively.

### Ultra-Fast Mode

```bash
stack-composer create next-full my-app --yes
```

Accepts all defaults. Zero prompts. Fastest possible project creation.

### AI Agent Mode

```bash
stack-composer create next-full my-app --json --yes
```

Outputs a structured JSON object for programmatic use:

```json
{
  "success": true,
  "projectPath": "/path/to/my-app",
  "stack": "next-full",
  "installedPackages": ["TypeScript", "Tailwind CSS", "ESLint"],
  "configApplied": ["base-scaffold", "post-setup", "tailwind-no-warnings", "git-init"],
  "packageManager": "pnpm",
  "messages": ["Project created in 12.3s"],
  "errors": [],
  "duration": 12345
}
```

### List Stacks

```bash
stack-composer list          # Pretty output
stack-composer list --json   # JSON output
```

## Available Stacks

| Stack ID      | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `next-full`   | Next.js 15 (App Router) + TypeScript + Tailwind + ESLint + Prettier |
| `next-shadcn` | Next.js 15 + Tailwind + Shadcn/ui + TypeScript                      |
| `astro`       | Astro + Tailwind + TypeScript                                       |
| `tanstack`    | TanStack Start (Router + Query) + Tailwind + TypeScript             |
| `vite-react`  | Vite + React + Tailwind + TypeScript                                |
| `sveltekit`   | SvelteKit + Tailwind + TypeScript                                   |

## Flags Reference

| Flag             | Description                      | Default |
| ---------------- | -------------------------------- | ------- |
| `--tailwind`     | Include Tailwind CSS             | `true`  |
| `--no-tailwind`  | Exclude Tailwind CSS             |         |
| `--eslint`       | Include ESLint                   | `true`  |
| `--no-eslint`    | Exclude ESLint                   |         |
| `--prettier`     | Include Prettier                 | `true`  |
| `--no-prettier`  | Exclude Prettier                 |         |
| `--git`          | Initialize Git + first commit    | `true`  |
| `--no-git`       | Skip Git                         |         |
| `--pm <manager>` | Package manager: pnpm, npm, yarn | `pnpm`  |
| `-y, --yes`      | Accept all defaults              |         |
| `--json`         | Output JSON (for AI agents)      |         |
| `--skills`       | Comma-separated list of additional skills/packages to install | `false` |

## Development

```bash
# Clone and install
git clone  && cd stack-composer
pnpm install

# Build
pnpm build

# Test interactively
node dist/cli.js create

# Test with flags
node dist/cli.js create next-full test-app --yes

# Test JSON output
node dist/cli.js create next-full test-app --json --yes

# Watch mode
pnpm dev
```

## Using from AI Agents

AI agents (Claude Code, Cursor, Aider, etc.) can call stack-composer programmatically:

```bash
# Create a project with JSON output
stack-composer create next-full my-project --json --yes 2>/dev/null
```

Parse the JSON response to verify success, check `configApplied`, and get the `projectPath`.

## License

MIT

If you find any mistakes please open a Github Issue