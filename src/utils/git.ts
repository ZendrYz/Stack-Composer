// ─── Stack Composer — Git Utility ───────────────────────────────────

import { exec } from './executor.js';
import { info, success, warn } from './logger.js';

/**
 * Initialize a git repo and make the first commit.
 */
export function initGit(projectPath: string): boolean {
  info('Initializing Git repository...');

  const initResult = exec('git init', projectPath, 'Initializing git');
  if (!initResult.success) {
    warn('Failed to initialize git repository.');
    return false;
  }

  const addResult = exec('git add -A', projectPath, 'Staging files');
  if (!addResult.success) {
    warn('Failed to stage files.');
    return false;
  }

  const commitResult = exec(
    'git commit -m "Initial project scaffold by stack-composer"',
    projectPath,
    'Creating initial commit'
  );

  if (!commitResult.success) {
    warn('Failed to create initial commit.');
    return false;
  }

  success('Git repository initialized with initial commit.');
  return true;
}
