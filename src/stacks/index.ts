// ─── Stack Composer — Stack Registry ────────────────────────────────
// Central registry of all supported stacks.

import type { StackDefinition, StackId } from '../types/index.js';
import { nextFull } from './next-full.js';
import { nextShadcn } from './next-shadcn.js';
import { astro } from './astro.js';
import { tanstack } from './tanstack.js';
import { viteReact } from './vite-react.js';
import { sveltekit } from './sveltekit.js';

/** All available stacks */
export const STACKS: Record<StackId, StackDefinition> = {
  'next-full': nextFull,
  'next-shadcn': nextShadcn,
  'astro': astro,
  'tanstack': tanstack,
  'vite-react': viteReact,
  'sveltekit': sveltekit,
};

/** Ordered list for display in menus */
export const STACK_LIST: StackDefinition[] = [
  nextFull,
  nextShadcn,
  astro,
  tanstack,
  viteReact,
  sveltekit,
];

/** Validate a stack ID */
export function isValidStack(id: string): id is StackId {
  return id in STACKS;
}

/** Get a stack by ID */
export function getStack(id: StackId): StackDefinition {
  return STACKS[id];
}
