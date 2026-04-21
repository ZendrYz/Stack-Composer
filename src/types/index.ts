// ─── Stack Composer — Core Types ────────────────────────────────────

/** Supported stack identifiers */
export type StackId = 'next-full' | 'next-shadcn' | 'astro' | 'tanstack' | 'vite-react' | 'sveltekit';

/** Supported package managers */
export type PackageManager = 'pnpm' | 'npm' | 'yarn';

/** Options gathered from flags + prompts */
export interface CreateOptions {
  /** Stack to scaffold */
  stack: StackId;
  /** Project directory name */
  projectName: string;
  /** Include Tailwind CSS */
  tailwind: boolean;
  /** Include ESLint configuration */
  eslint: boolean;
  /** Include Prettier configuration */
  prettier: boolean;
  /** Initialize git repository */
  git: boolean;
  /** Package manager to use */
  packageManager: PackageManager;
  /** Accept all defaults without prompting */
  yes: boolean;
  /** Output JSON for AI agents */
  json: boolean;
  /** Dry run mode: print commands without executing them */
  dryRun: boolean;
  /** Additional skills/packages to install directly */
  skills: string[];
}

/** JSON response format for AI agents */
export interface JsonOutput {
  success: boolean;
  projectPath: string;
  stack: StackId;
  installedPackages: string[];
  configApplied: string[];
  packageManager: PackageManager;
  messages: string[];
  errors: string[];
  duration: number;
}

/** Stack definition for registry */
export interface StackDefinition {
  id: StackId;
  name: string;
  description: string;
  /** Base command to scaffold the project */
  scaffoldCommand: (projectName: string, pm: PackageManager) => string;
  /** Additional dependencies to install */
  extraDeps: string[];
  /** Additional dev-dependencies to install */
  extraDevDeps: string[];
  /** Post-scaffold setup steps */
  postSetup?: (projectPath: string, options: CreateOptions) => Promise<void>;
  /** Default features included in this stack */
  defaultFeatures: string[];
}

/** Log levels for the logger */
export type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';
