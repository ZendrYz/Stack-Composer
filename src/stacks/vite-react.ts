// ─── Stack Composer — Vite + React Stack ────────────────────────────
// Vite + React + Tailwind + TypeScript

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { StackDefinition, CreateOptions } from '../types/index.js';
import { execOrThrow } from '../utils/executor.js';
import { addCommand } from '../utils/package-manager.js';
import { configureTailwindNoWarnings, writeTailwindCSS } from '../utils/tailwind.js';
import { info, isDryRun } from '../utils/logger.js';

async function postSetup(projectPath: string, options: CreateOptions): Promise<void> {
  if (options.tailwind) {
    info('Adding Tailwind CSS to Vite project...');

    execOrThrow(
      addCommand(options.packageManager, ['tailwindcss', '@tailwindcss/vite'], true),
      projectPath,
      'Installing Tailwind CSS'
    );

    // Update vite.config.ts to include Tailwind plugin
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
`;

    if (!isDryRun()) {
      writeFileSync(join(projectPath, 'vite.config.ts'), viteConfig, 'utf-8');
    }

    // Write the Tailwind CSS import
    writeTailwindCSS(projectPath, 'src/index.css');

    configureTailwindNoWarnings(projectPath);
  }

  if (options.eslint) {
    info('ESLint is already configured by Vite scaffold.');
  }
}

export const viteReact: StackDefinition = {
  id: 'vite-react',
  name: 'Vite + React',
  description: 'Vite + React + Tailwind CSS + TypeScript',
  scaffoldCommand: (projectName, _pm) => {
    return `npm create vite@latest ${projectName} -- --template react-ts`;
  },
  extraDeps: [],
  extraDevDeps: [],
  postSetup,
  defaultFeatures: ['TypeScript', 'React', 'Tailwind CSS', 'ESLint'],
};
