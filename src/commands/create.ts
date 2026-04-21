// ─── Stack Composer — Create Command ────────────────────────────────
// Core logic: scaffold a project from a stack definition.

import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import type { CreateOptions, JsonOutput } from '../types/index.js';
import { getStack, isValidStack } from '../stacks/index.js';
import { execOrThrow, commandExists } from '../utils/executor.js';
import { installCommand, addCommand } from '../utils/package-manager.js';
import { initGit } from '../utils/git.js';
import {
  section,
  success,
  error,
  info,
  summaryBox,
  printSuccess,
  isJsonMode,
} from '../utils/logger.js';

/**
 * Execute the full project creation pipeline.
 * Returns a JsonOutput object for --json mode.
 */
export async function createProject(options: CreateOptions): Promise<JsonOutput> {
  const startTime = Date.now();

  const result: JsonOutput = {
    success: false,
    projectPath: '',
    stack: options.stack,
    installedPackages: [],
    configApplied: [],
    packageManager: options.packageManager,
    messages: [],
    errors: [],
    duration: 0,
  };

  try {
    // ─── Validate Stack ───────────────────────────────────────────────
    if (!isValidStack(options.stack)) {
      throw new Error(`Unknown stack: "${options.stack}". Use --help to see available stacks.`);
    }

    const stack = getStack(options.stack);
    const projectPath = resolve(process.cwd(), options.projectName);
    result.projectPath = projectPath;

    // ─── Pre-flight Checks ───────────────────────────────────────────
    section('Running Pre-flight Checks');
    
    // 1. Verify project name logic
    const nameRegex = /^[A-Za-z0-9\-\_.]+$/;
    if (options.projectName !== '.' && !nameRegex.test(options.projectName)) {
      throw new Error(
        `Invalid project name "${options.projectName}". Only letters, numbers, dashes, and underscores are allowed.`
      );
    }

    // 2. Check existing directory
    if (options.projectName !== '.' && existsSync(projectPath)) {
      const files = readdirSync(projectPath);
      if (files.length > 0) {
        throw new Error(
          `Directory "${options.projectName}" already exists and is not empty. Choose a different name or empty the directory.`
        );
      }
    }

    // 3. Package Manager
    if (!commandExists(options.packageManager)) {
      throw new Error(
        `Package manager "${options.packageManager}" is not installed or not in PATH.`
      );
    }

    // 4. Git Check
    if (options.git && !commandExists('git')) {
      throw new Error(
        `Git is requested but not installed or not in PATH. Please install Git or run with --no-git.`
      );
    }

    // ─── Summary ─────────────────────────────────────────────────────
    section('Project Configuration');
    summaryBox({
      'Stack': stack.name,
      'Project': options.projectName,
      'Tailwind': options.tailwind ? '✔' : '✖',
      'ESLint': options.eslint ? '✔' : '✖',
      'Prettier': options.prettier ? '✔' : '✖',
      'Git': options.git ? '✔' : '✖',
      'Package Mgr': options.packageManager,
    });

    // ─── Scaffold ────────────────────────────────────────────────────
    section('Scaffolding Project');
    const scaffoldCmd = stack.scaffoldCommand(options.projectName, options.packageManager);
    result.messages.push(`Scaffolding with: ${scaffoldCmd}`);

    execOrThrow(scaffoldCmd, process.cwd(), `Creating ${stack.name} project`);
    result.configApplied.push('base-scaffold');
    result.installedPackages.push(...stack.defaultFeatures);

    // ─── Install dependencies ────────────────────────────────────────
    section('Installing Dependencies');

    const allDeps = [...stack.extraDeps, ...(options.skills || [])];
    if (allDeps.length > 0) {
      execOrThrow(
        addCommand(options.packageManager, allDeps),
        projectPath,
        'Installing additional dependencies & skills'
      );
      result.installedPackages.push(...allDeps);
    }

    if (stack.extraDevDeps.length > 0) {
      execOrThrow(
        addCommand(options.packageManager, stack.extraDevDeps, true),
        projectPath,
        'Installing dev dependencies'
      );
      result.installedPackages.push(...stack.extraDevDeps);
    }

    // ─── Post-setup ──────────────────────────────────────────────────
    if (stack.postSetup) {
      section('Post-Setup Configuration');
      await stack.postSetup(projectPath, options);
      result.configApplied.push('post-setup');

      if (options.tailwind) result.configApplied.push('tailwind-no-warnings');
      if (options.prettier) result.configApplied.push('prettier');
    }

    // ─── Git ─────────────────────────────────────────────────────────
    if (options.git) {
      section('Git Setup');
      const gitSuccess = initGit(projectPath);
      if (gitSuccess) {
        result.configApplied.push('git-init');
        result.configApplied.push('git-initial-commit');
      }
    }

    // ─── Done ────────────────────────────────────────────────────────
    result.success = true;
    result.duration = Date.now() - startTime;
    result.messages.push(`Project created in ${(result.duration / 1000).toFixed(1)}s`);

    printSuccess(options.projectName, options.packageManager);

    return result;
  } catch (err: any) {
    result.success = false;
    result.duration = Date.now() - startTime;
    result.errors.push(err.message || 'Unknown error');

    if (!isJsonMode()) {
      console.log('');
      error(`Failed to create project: ${err.message}`);
      console.log('');
      console.log(chalk.dim('  If this looks like a bug, please report it at:'));
      console.log(chalk.dim('  https://github.com/stack-composer/issues'));
      console.log('');
    }

    return result;
  }
}
