// ─── Stack Composer — Next.js + Shadcn Stack ───────────────────────
// Next.js 15 + Tailwind + Shadcn/ui + TypeScript

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { StackDefinition, CreateOptions } from '../types/index.js';
import { execOrThrow } from '../utils/executor.js';
import { dlxCommand } from '../utils/package-manager.js';
import { configureTailwindNoWarnings } from '../utils/tailwind.js';
import { info } from '../utils/logger.js';

async function postSetup(projectPath: string, options: CreateOptions): Promise<void> {
  info('Initializing Shadcn/ui...');

  // Initialize shadcn with defaults
  execOrThrow(
    `${dlxCommand(options.packageManager)} shadcn@latest init --defaults --force`,
    projectPath,
    'Initializing Shadcn/ui'
  );

  // Install a few essential components
  execOrThrow(
    `${dlxCommand(options.packageManager)} shadcn@latest add button card input --overwrite`,
    projectPath,
    'Adding Shadcn base components (button, card, input)'
  );

  // ─── Tailwind no-warnings ──────────────────────────────────────────
  if (options.tailwind) {
    configureTailwindNoWarnings(projectPath);
  }
}

export const nextShadcn: StackDefinition = {
  id: 'next-shadcn',
  name: 'Next.js + Shadcn/ui',
  description: 'Next.js 15 + Tailwind CSS + Shadcn/ui + TypeScript',
  scaffoldCommand: (projectName, pm) => {
    const pmFlag = pm === 'pnpm' ? '--use-pnpm' : pm === 'yarn' ? '--use-yarn' : '--use-npm';
    return `npx -y create-next-app@latest ${projectName} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" ${pmFlag}`;
  },
  extraDeps: [],
  extraDevDeps: [],
  postSetup,
  defaultFeatures: ['TypeScript', 'Tailwind CSS', 'Shadcn/ui', 'ESLint', 'App Router'],
};
