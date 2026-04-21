// ─── Stack Composer — Shell Executor ────────────────────────────────
// Runs shell commands with spinner feedback and error handling.

import { execSync } from 'node:child_process';
import { spinner, isJsonMode, isDryRun, info } from './logger.js';

export interface ExecResult {
  success: boolean;
  output: string;
  error?: string;
}

/**
 * Execute a shell command with a spinner.
 * In JSON mode, the spinner is silent.
 */
export function exec(
  command: string,
  cwd: string,
  label?: string
): ExecResult {
  const spin = spinner(label ?? `Running: ${command}`);
  spin.start();

  if (isDryRun()) {
    spin.succeed(`[DRY RUN] ${label ?? command}`);
    return { success: true, output: '' };
  }

  try {
    const output = execSync(command, {
      cwd,
      encoding: 'utf-8',
      stdio: isJsonMode() ? 'pipe' : ['pipe', 'pipe', 'pipe'],
      timeout: 300_000, // 5 min timeout
    });

    spin.succeed(label ?? command);
    return { success: true, output: output ?? '' };
  } catch (err: any) {
    const message = err.stderr?.toString() || err.message || 'Unknown error';
    spin.fail(label ?? command);
    return { success: false, output: '', error: message };
  }
}

/**
 * Execute a command and throw on failure.
 */
export function execOrThrow(
  command: string,
  cwd: string,
  label?: string
): string {
  const result = exec(command, cwd, label);
  if (!result.success) {
    throw new Error(result.error ?? `Command failed: ${command}`);
  }
  return result.output;
}

/**
 * Check if a command is available on the system.
 */
export function commandExists(cmd: string): boolean {
  try {
    const isWin = process.platform === 'win32';
    execSync(`${isWin ? 'where' : 'which'} ${cmd}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}
