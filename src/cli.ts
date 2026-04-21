#!/usr/bin/env node

// ─── Stack Composer — CLI Entry Point ───────────────────────────────
// Main entry point: parses args, decides mode, and runs the pipeline.

import { Command } from 'commander';
import chalk from 'chalk';
import type { CreateOptions, StackId, PackageManager } from './types/index.js';
import { STACK_LIST, isValidStack } from './stacks/index.js';
import { runInteractivePrompts, buildDefaultOptions } from './prompts/interactive.js';
import { createProject } from './commands/create.js';
import { printBanner, setJsonMode, setDryRun, error, info, section } from './utils/logger.js';

const program = new Command();

program
  .name('stack-composer')
  .description('Scaffold modern web projects — fast, clean, complete.')
  .version('1.0.0');

// ─── Create Command ─────────────────────────────────────────────────

program
  .command('create')
  .description('Create a new project from a stack template.')
  .argument('[stack]', 'Stack to use: next-full, next-shadcn, astro, tanstack, vite-react')
  .argument('[project-name]', 'Name of the project directory')
  .option('--tailwind', 'Include Tailwind CSS', undefined)
  .option('--no-tailwind', 'Exclude Tailwind CSS')
  .option('--eslint', 'Include ESLint', undefined)
  .option('--no-eslint', 'Exclude ESLint')
  .option('--prettier', 'Include Prettier', undefined)
  .option('--no-prettier', 'Exclude Prettier')
  .option('--git', 'Initialize Git repository', undefined)
  .option('--no-git', 'Skip Git initialization')
  .option('--pm <manager>', 'Package manager: pnpm, npm, yarn')
  .option('-y, --yes', 'Accept all defaults (no prompts)', false)
  .option('--json', 'Output JSON (for AI agents)', false)
  .option('--dry-run', 'Print commands without executing them', false)
  .option('--skills <items>', 'Comma-separated list of additional skills/packages to install', '')
  .action(async (stackArg: string | undefined, projectNameArg: string | undefined, flags: any) => {
    // ─── JSON Mode ────────────────────────────────────────────────────
    const isJson = flags.json === true;
    setJsonMode(isJson);
    setDryRun(flags.dryRun === true);

    // ─── Banner ───────────────────────────────────────────────────────
    printBanner();

    // ─── Build partial options from flags ─────────────────────────────
    const partial: Partial<CreateOptions> = {
      json: isJson,
      yes: flags.yes === true,
      dryRun: flags.dryRun === true,
      skills: flags.skills ? flags.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };

    if (stackArg && isValidStack(stackArg)) {
      partial.stack = stackArg as StackId;
    } else if (stackArg && !isValidStack(stackArg)) {
      // Maybe they passed project name as the first arg
      if (!projectNameArg) {
        // stackArg is actually the project name, no stack specified
        partial.projectName = stackArg;
      } else {
        if (!isJson) {
          error(`Unknown stack "${stackArg}". Available stacks:`);
          STACK_LIST.forEach((s) => {
            console.log(`    ${chalk.cyan(s.id.padEnd(14))} ${chalk.dim(s.description)}`);
          });
          console.log('');
        }
        if (isJson) {
          console.log(JSON.stringify({
            success: false,
            errors: [`Unknown stack: "${stackArg}"`],
            availableStacks: STACK_LIST.map((s) => s.id),
          }, null, 2));
        }
        process.exit(1);
      }
    }

    if (projectNameArg) {
      partial.projectName = projectNameArg;
    }

    // Map commander flags → partial options
    if (flags.tailwind !== undefined) partial.tailwind = flags.tailwind;
    if (flags.eslint !== undefined) partial.eslint = flags.eslint;
    if (flags.prettier !== undefined) partial.prettier = flags.prettier;
    if (flags.git !== undefined) partial.git = flags.git;
    if (flags.pm) partial.packageManager = flags.pm as PackageManager;

    // ─── Determine Mode ──────────────────────────────────────────────
    let options: CreateOptions;

    if (flags.yes || isJson) {
      // Ultra-fast / Agent mode: use defaults for anything not specified
      options = buildDefaultOptions(partial);
      if (!isJson) {
        section('Mode: Ultra-Fast (--yes)');
        info('Using defaults for all unspecified options.');
      }
    } else {
      // Interactive mode: prompt for missing values
      if (!isJson) {
        section('Mode: Interactive');
      }
      options = await runInteractivePrompts(partial);
    }

    const result = await createProject(options);

    // ─── JSON Output ─────────────────────────────────────────────────
    if (isJson) {
      console.log(JSON.stringify(result, null, 2));
    }

    process.exit(result.success ? 0 : 1);
  });

// ─── List Command ───────────────────────────────────────────────────

program
  .command('list')
  .description('List all available stacks.')
  .option('--json', 'Output as JSON', false)
  .action((flags: any) => {
    if (flags.json) {
      console.log(JSON.stringify(
        STACK_LIST.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          defaultFeatures: s.defaultFeatures,
        })),
        null,
        2
      ));
    } else {
      printBanner();
      section('Available Stacks');
      console.log('');
      STACK_LIST.forEach((s) => {
        console.log(`  ${chalk.hex('#7C3AED').bold(s.id.padEnd(14))} ${s.description}`);
        console.log(`  ${' '.repeat(14)} ${chalk.dim('Features: ' + s.defaultFeatures.join(', '))}`);
        console.log('');
      });
    }
  });

// ─── Default (no command) → show help ───────────────────────────────

if (process.argv.length <= 2) {
  printBanner();
  program.outputHelp();
  console.log('');
  console.log(chalk.dim('  Examples:'));
  console.log(chalk.cyan('    stack-composer create                              ') + chalk.dim('# Interactive mode'));
  console.log(chalk.cyan('    stack-composer create next-full my-app --yes       ') + chalk.dim('# Ultra-fast mode'));
  console.log(chalk.cyan('    stack-composer create next-full my-app --json --yes') + chalk.dim('# AI agent mode'));
  console.log(chalk.cyan('    stack-composer list                                ') + chalk.dim('# List all stacks'));
  console.log('');
  process.exit(0);
}

program.parse();
