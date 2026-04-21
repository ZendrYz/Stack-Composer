// ─── Stack Composer — SvelteKit Stack ─────────────────────────────────
// SvelteKit + Tailwind CSS + TypeScript

import type { StackDefinition, CreateOptions } from '../types/index.js';
import { execOrThrow } from '../utils/executor.js';
import { addCommand } from '../utils/package-manager.js';
import { configureTailwindNoWarnings } from '../utils/tailwind.js';
import { info } from '../utils/logger.js';

async function postSetup(projectPath: string, options: CreateOptions): Promise<void> {
  if (options.tailwind) {
    info('Adding Tailwind CSS to SvelteKit project...');

    execOrThrow(
      addCommand(options.packageManager, ['tailwindcss', '@tailwindcss/vite'], true),
      projectPath,
      'Installing Tailwind CSS'
    );

    // Note: SvelteKit handles CSS imports in app.css or similar natively via Vite
    configureTailwindNoWarnings(projectPath);
  }
}

export const sveltekit: StackDefinition = {
  id: 'sveltekit',
  name: 'SvelteKit',
  description: 'SvelteKit + Tailwind CSS + TypeScript',
  scaffoldCommand: (projectName, _pm) => {
    // create-svelte uses interactive prompts by default or expects arguments
    // We use sv template which is the standard now: npx sv create <dir>
    // However sv create is also interactive. We will use a predefined template.
    // Let's use `npx -y sv create <dir> --template standard --types ts`
    // Actually `npx -y sv create` might prompt for things. We can use `create-vite` with svelte-ts instead.
    // `npm create vite@latest <dir> -- --template svelte-ts`
    return `npm create vite@latest ${projectName} -- --template svelte-ts`;
  },
  extraDeps: [],
  extraDevDeps: [],
  postSetup,
  defaultFeatures: ['TypeScript', 'Svelte', 'Tailwind CSS'],
};
