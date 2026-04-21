// ─── Stack Composer — Astro Stack ───────────────────────────────────
// Astro + Tailwind + TypeScript

import type { StackDefinition, CreateOptions } from '../types/index.js';
import { execOrThrow } from '../utils/executor.js';
import { addCommand } from '../utils/package-manager.js';
import { configureTailwindNoWarnings } from '../utils/tailwind.js';
import { info } from '../utils/logger.js';

async function postSetup(projectPath: string, options: CreateOptions): Promise<void> {
  if (options.tailwind) {
    info('Adding Tailwind CSS to Astro...');

    execOrThrow(
      `npx -y astro add tailwind --yes`,
      projectPath,
      'Adding Tailwind CSS integration'
    );

    configureTailwindNoWarnings(projectPath);
  }
}

export const astro: StackDefinition = {
  id: 'astro',
  name: 'Astro',
  description: 'Astro + Tailwind CSS + TypeScript',
  scaffoldCommand: (projectName, _pm) => {
    return `npm create astro@latest ${projectName} -- --template basics --typescript strict --install --no-git`;
  },
  extraDeps: [],
  extraDevDeps: [],
  postSetup,
  defaultFeatures: ['TypeScript', 'Tailwind CSS'],
};
