// ─── Stack Composer — Next.js Full Stack ────────────────────────────
// Next.js 15 (App Router) + TypeScript + Tailwind CSS + ESLint + Prettier

import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { StackDefinition, CreateOptions } from '../types/index.js';
import { execOrThrow } from '../utils/executor.js';
import { addCommand } from '../utils/package-manager.js';
import { configureTailwindNoWarnings } from '../utils/tailwind.js';
import { info, isDryRun } from '../utils/logger.js';

async function postSetup(projectPath: string, options: CreateOptions): Promise<void> {
  // ─── Prettier ─────────────────────────────────────────────────────
  if (options.prettier) {
    info('Setting up Prettier...');

    execOrThrow(
      addCommand(options.packageManager, ['prettier', 'eslint-config-prettier'], true),
      projectPath,
      'Installing Prettier'
    );

    const prettierConfig = {
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
      tabWidth: 2,
      printWidth: 100,
      plugins: [],
    };

    if (!isDryRun()) {
      writeFileSync(
        join(projectPath, '.prettierrc'),
        JSON.stringify(prettierConfig, null, 2),
        'utf-8'
      );

      writeFileSync(
        join(projectPath, '.prettierignore'),
        'node_modules\n.next\ndist\nbuild\ncoverage\n',
        'utf-8'
      );
    }
  }

  // ─── Tailwind no-warnings ──────────────────────────────────────────
  if (options.tailwind) {
    configureTailwindNoWarnings(projectPath);
  }
}

export const nextFull: StackDefinition = {
  id: 'next-full',
  name: 'Next.js Full',
  description: 'Next.js 15 (App Router) + TypeScript + Tailwind CSS + ESLint + Prettier',
  scaffoldCommand: (projectName, pm) => {
    const pmFlag = pm === 'pnpm' ? '--use-pnpm' : pm === 'yarn' ? '--use-yarn' : '--use-npm';
    return `npx -y create-next-app@latest ${projectName} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" ${pmFlag}`;
  },
  extraDeps: [],
  extraDevDeps: [],
  postSetup,
  defaultFeatures: ['TypeScript', 'Tailwind CSS', 'ESLint', 'App Router', 'src/ directory'],
};
