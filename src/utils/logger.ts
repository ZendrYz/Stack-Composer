// ─── Stack Composer — Logger Utility ────────────────────────────────
// Provides beautiful terminal output with chalk, ora, and figlet.

import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import figlet from 'figlet';
import type { LogLevel } from '../types/index.js';

/** Whether JSON mode is active (suppresses visual output) */
let jsonMode = false;
/** Whether Dry Run mode is active (suppresses execution) */
let dryRunMode = false;

export function setJsonMode(enabled: boolean): void {
  jsonMode = enabled;
}

export function isJsonMode(): boolean {
  return jsonMode;
}

export function setDryRun(enabled: boolean): void {
  dryRunMode = enabled;
}

export function isDryRun(): boolean {
  return dryRunMode;
}

// ─── Banner ─────────────────────────────────────────────────────────

export function printBanner(): void {
  if (jsonMode) return;

  const banner = figlet.textSync('Stack Composer', {
    font: 'Small',
    horizontalLayout: 'default',
  });

  console.log('');
  console.log(chalk.hex('#7C3AED')(banner));
  console.log(
    chalk.dim('  Scaffold modern web projects — fast, clean, complete.')
  );
  console.log(
    chalk.dim(`  v1.0.0  •  ${chalk.hex('#7C3AED')('https://github.com/stack-composer')}`)
  );
  console.log('');
}

// ─── Log Functions ──────────────────────────────────────────────────

const ICONS: Record<LogLevel, string> = {
  info: chalk.blue('ℹ'),
  success: chalk.green('✔'),
  warn: chalk.yellow('⚠'),
  error: chalk.red('✖'),
  debug: chalk.gray('●'),
};

export function log(level: LogLevel, message: string): void {
  if (jsonMode) return;
  console.log(`  ${ICONS[level]}  ${message}`);
}

export function info(message: string): void {
  log('info', message);
}

export function success(message: string): void {
  log('success', chalk.green(message));
}

export function warn(message: string): void {
  log('warn', chalk.yellow(message));
}

export function error(message: string): void {
  log('error', chalk.red(message));
}

export function debug(message: string): void {
  log('debug', chalk.gray(message));
}

// ─── Spinner ────────────────────────────────────────────────────────

export function spinner(text: string): Ora {
  if (jsonMode) {
    // Return a no-op spinner in JSON mode
    return ora({ text, isSilent: true });
  }
  return ora({
    text,
    color: 'magenta',
    spinner: 'dots',
  });
}

// ─── Section Headers ────────────────────────────────────────────────

export function section(title: string): void {
  if (jsonMode) return;
  console.log('');
  console.log(`  ${chalk.hex('#7C3AED').bold('▸')} ${chalk.bold(title)}`);
  console.log(`  ${chalk.dim('─'.repeat(50))}`);
}

// ─── Summary Box ────────────────────────────────────────────────────

export function summaryBox(items: Record<string, string>): void {
  if (jsonMode) return;
  console.log('');
  console.log(chalk.hex('#7C3AED')('  ┌─────────────────────────────────────────────┐'));

  for (const [key, value] of Object.entries(items)) {
    const paddedKey = key.padEnd(16);
    console.log(
      chalk.hex('#7C3AED')('  │') +
        `  ${chalk.dim(paddedKey)} ${chalk.white(value)}`.padEnd(54) +
        chalk.hex('#7C3AED')('│')
    );
  }

  console.log(chalk.hex('#7C3AED')('  └─────────────────────────────────────────────┘'));
  console.log('');
}

// ─── Final Success ──────────────────────────────────────────────────

export function printSuccess(projectName: string, packageManager: string): void {
  if (jsonMode) return;

  console.log('');
  console.log(chalk.green.bold('  Project created successfully!'));
  console.log('');
  console.log(chalk.white('  Get started:'));
  console.log('');
  console.log(chalk.cyan(`    cd ${projectName}`));
  console.log(chalk.cyan(`    ${packageManager} run dev`));
  console.log('');
  console.log(chalk.dim('  Happy coding!'));
  console.log('');
}
