// ─── Stack Composer — Tailwind CSS Utility ──────────────────────────
// Configures Tailwind CSS without "Unknown at rule" warnings by
// adding the proper VS Code settings.

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { info, success, isDryRun } from './logger.js';

/**
 * Write VS Code settings to suppress Tailwind "Unknown at rule" warnings.
 * Also writes a postcss config if not already present.
 */
export function configureTailwindNoWarnings(projectPath: string): void {
  info('Configuring Tailwind CSS (no unknown-at-rule warnings)...');

  if (isDryRun()) {
    success('[DRY RUN] VS Code configured for Tailwind CSS (no warnings).');
    return;
  }

  // ─── VS Code Settings ──────────────────────────────────────────────
  const vscodePath = join(projectPath, '.vscode');
  if (!existsSync(vscodePath)) {
    mkdirSync(vscodePath, { recursive: true });
  }

  const settingsPath = join(vscodePath, 'settings.json');
  let existingSettings: Record<string, any> = {};

  if (existsSync(settingsPath)) {
    try {
      existingSettings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    } catch {
      // Ignore parse errors, just start fresh
    }
  }

  const vscodeSettings = {
    ...existingSettings,
    'css.customData': ['.vscode/tailwind.json'],
    'css.lint.unknownAtRules': 'ignore',
    'scss.lint.unknownAtRules': 'ignore',
    'less.lint.unknownAtRules': 'ignore',
    'editor.quickSuggestions': {
      ...existingSettings['editor.quickSuggestions'],
      strings: 'on',
    },
  };

  writeFileSync(settingsPath, JSON.stringify(vscodeSettings, null, 2), 'utf-8');

  // ─── Custom CSS Data for VS Code ───────────────────────────────────
  const customDataPath = join(vscodePath, 'tailwind.json');
  const customData = {
    version: 1.1,
    atDirectives: [
      {
        name: '@tailwind',
        description:
          "Use the @tailwind directive to insert Tailwind's `base`, `components`, `utilities`, and `variants` styles.",
      },
      {
        name: '@apply',
        description:
          'Use the @apply directive to inline any existing utility classes into your own custom CSS.',
      },
      {
        name: '@layer',
        description:
          'Use the @layer directive to tell Tailwind which "bucket" a set of custom styles belong to.',
      },
      {
        name: '@config',
        description: 'Use the @config directive to specify which config file Tailwind should use.',
      },
      {
        name: '@plugin',
        description: 'Use the @plugin directive to import a Tailwind CSS plugin.',
      },
      {
        name: '@variant',
        description: 'Use the @variant directive to apply a Tailwind variant to a block of CSS.',
      },
      {
        name: '@reference',
        description: 'Use the @reference directive to reference another Tailwind file.',
      },
      {
        name: '@theme',
        description: 'Use the @theme directive to define custom theme values.',
      },
      {
        name: '@utility',
        description: 'Use the @utility directive to define custom utility classes.',
      },
      {
        name: '@source',
        description: 'Use the @source directive to specify additional content paths.',
      },
    ],
  };

  writeFileSync(customDataPath, JSON.stringify(customData, null, 2), 'utf-8');

  success('VS Code configured for Tailwind CSS (no warnings).');
}

/**
 * Write the Tailwind CSS v4 app.css / globals.css import.
 */
export function writeTailwindCSS(projectPath: string, cssPath: string): void {
  if (isDryRun()) return;

  const fullPath = join(projectPath, cssPath);
  const content = `@import "tailwindcss";
`;

  writeFileSync(fullPath, content, 'utf-8');
}
