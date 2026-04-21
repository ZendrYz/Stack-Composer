// ─── Stack Composer — Interactive Prompts ───────────────────────────
// Beautiful inquirer-based prompts for the interactive mode.

import inquirer from 'inquirer';
import chalk from 'chalk';
import type { CreateOptions, StackId, PackageManager } from '../types/index.js';
import { STACK_LIST } from '../stacks/index.js';
import { detectPackageManager } from '../utils/package-manager.js';

/**
 * Run the full interactive prompt flow.
 * Merges with any partial options already provided via flags.
 */
export async function runInteractivePrompts(
  partial: Partial<CreateOptions>
): Promise<CreateOptions> {
  const questions: any[] = [];

  // ─── Stack Selection ──────────────────────────────────────────────
  if (!partial.stack) {
    questions.push({
      type: 'list',
      name: 'stack',
      message: chalk.hex('#7C3AED')('Which stack do you want to use?'),
      choices: STACK_LIST.map((s) => ({
        name: `${chalk.bold(s.name)} ${chalk.dim('—')} ${chalk.dim(s.description)}`,
        value: s.id,
        short: s.name,
      })),
    });
  }

  // ─── Project Name ─────────────────────────────────────────────────
  if (!partial.projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: chalk.hex('#7C3AED')('Project name:'),
      default: 'my-app',
      validate: (input: string) => {
        if (!input.trim()) return 'Project name is required.';
        if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
          return 'Only letters, numbers, hyphens and underscores allowed.';
        }
        return true;
      },
    });
  }

  // ─── Extras ───────────────────────────────────────────────────────
  if (partial.tailwind === undefined) {
    questions.push({
      type: 'confirm',
      name: 'tailwind',
      message: 'Include Tailwind CSS?',
      default: true,
    });
  }

  if (partial.eslint === undefined) {
    questions.push({
      type: 'confirm',
      name: 'eslint',
      message: 'Include ESLint?',
      default: true,
    });
  }

  if (partial.prettier === undefined) {
    questions.push({
      type: 'confirm',
      name: 'prettier',
      message: 'Include Prettier?',
      default: true,
    });
  }

  if (partial.git === undefined) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize Git repository?',
      default: true,
    });
  }

  // ─── Package Manager ──────────────────────────────────────────────
  if (!partial.packageManager) {
    const detected = detectPackageManager();
    questions.push({
      type: 'list',
      name: 'packageManager',
      message: chalk.hex('#7C3AED')('Package manager:'),
      choices: [
        { name: `pnpm ${detected === 'pnpm' ? chalk.dim('(detected)') : ''}`, value: 'pnpm' },
        { name: `npm ${detected === 'npm' ? chalk.dim('(detected)') : ''}`, value: 'npm' },
        { name: `yarn ${detected === 'yarn' ? chalk.dim('(detected)') : ''}`, value: 'yarn' },
      ],
      default: detected,
    });
  }

  // ─── Extra Skills / Packages ──────────────────────────────────────
  if (!partial.skills || partial.skills.length === 0) {
    questions.push({
      type: 'input',
      name: 'skills',
      message: chalk.hex('#7C3AED')('Additional skills/packages to install') + chalk.dim(' (comma-separated, leave blank for none):'),
      filter: (input: string) => {
        if (!input.trim()) return [];
        return input.split(',').map((s) => s.trim()).filter(Boolean);
      },
    });
  }

  // If no questions, return the partial as-is (all flags provided)
  if (questions.length === 0) {
    return partial as CreateOptions;
  }

  const answers = await inquirer.prompt(questions);

  return {
    stack: partial.stack ?? answers.stack,
    projectName: partial.projectName ?? answers.projectName,
    tailwind: partial.tailwind ?? answers.tailwind ?? true,
    eslint: partial.eslint ?? answers.eslint ?? true,
    prettier: partial.prettier ?? answers.prettier ?? true,
    git: partial.git ?? answers.git ?? true,
    packageManager: partial.packageManager ?? answers.packageManager ?? detectPackageManager(),
    yes: partial.yes ?? false,
    json: partial.json ?? false,
    dryRun: partial.dryRun ?? false,
    skills: partial.skills?.length ? partial.skills : (answers.skills ?? []),
  };
}

/**
 * Build options using --yes defaults (no interaction).
 */
export function buildDefaultOptions(partial: Partial<CreateOptions>): CreateOptions {
  return {
    stack: partial.stack ?? 'next-full',
    projectName: partial.projectName ?? 'my-app',
    tailwind: partial.tailwind ?? true,
    eslint: partial.eslint ?? true,
    prettier: partial.prettier ?? true,
    git: partial.git ?? true,
    packageManager: partial.packageManager ?? detectPackageManager(),
    yes: true,
    json: partial.json ?? false,
    dryRun: partial.dryRun ?? false,
    skills: partial.skills ?? [],
  };
}
