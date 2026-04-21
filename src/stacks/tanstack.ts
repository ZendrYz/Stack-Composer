// ─── Stack Composer — TanStack Start Stack ─────────────────────────
// TanStack Start (React Router + TanStack Query) + Tailwind + TypeScript

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { StackDefinition, CreateOptions } from '../types/index.js';
import { execOrThrow } from '../utils/executor.js';
import { addCommand, installCommand } from '../utils/package-manager.js';
import { configureTailwindNoWarnings } from '../utils/tailwind.js';
import { info } from '../utils/logger.js';

async function postSetup(projectPath: string, options: CreateOptions): Promise<void> {
  if (options.tailwind) {
    info('Adding Tailwind CSS...');

    execOrThrow(
      addCommand(options.packageManager, ['tailwindcss', '@tailwindcss/vite'], true),
      projectPath,
      'Installing Tailwind CSS'
    );

    configureTailwindNoWarnings(projectPath);
  }
}

export const tanstack: StackDefinition = {
  id: 'tanstack',
  name: 'TanStack Start',
  description: 'TanStack Start (React Router + TanStack Query) + Tailwind + TypeScript',
  scaffoldCommand: (projectName, _pm) => {
    return `npx -y create-tsrouter-app@latest ${projectName} --template file-router --add-on tanstack-query --package-manager pnpm`;
  },
  extraDeps: [],
  extraDevDeps: [],
  postSetup,
  defaultFeatures: ['TypeScript', 'TanStack Router', 'TanStack Query', 'Tailwind CSS'],
};
