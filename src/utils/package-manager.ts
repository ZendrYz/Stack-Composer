// ─── Stack Composer — Package Manager Utility ──────────────────────

import type { PackageManager } from '../types/index.js';
import { commandExists } from './executor.js';

/**
 * Detect the best available package manager.
 * Preference: pnpm > yarn > npm
 */
export function detectPackageManager(): PackageManager {
  if (commandExists('pnpm')) return 'pnpm';
  if (commandExists('yarn')) return 'yarn';
  return 'npm';
}

/**
 * Get the install command for a package manager.
 */
export function installCommand(pm: PackageManager): string {
  return pm === 'yarn' ? 'yarn' : `${pm} install`;
}

/**
 * Get the add-dependency command for a package manager.
 */
export function addCommand(
  pm: PackageManager,
  deps: string[],
  dev = false
): string {
  const depsStr = deps.join(' ');
  switch (pm) {
    case 'pnpm':
      return `pnpm add ${dev ? '-D ' : ''}${depsStr}`;
    case 'yarn':
      return `yarn add ${dev ? '--dev ' : ''}${depsStr}`;
    case 'npm':
      return `npm install ${dev ? '--save-dev ' : ''}${depsStr}`;
  }
}

/**
 * Get the exec/dlx command for a package manager.
 */
export function dlxCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm dlx';
    case 'yarn':
      return 'yarn dlx';
    case 'npm':
      return 'npx -y';
  }
}
