'use client';

import { useSyncExternalStore } from 'react';

/**
 * A small page-wide choice (package manager, framework) that every component
 * using the same key shares, remembered in localStorage. The server render
 * uses the fallback, and the stored choice applies right after hydration.
 */
function createChoice<T extends string>(key: string, options: readonly T[], fallback: T) {
  const listeners = new Set<() => void>();
  let current: T | undefined;

  const read = (): T => {
    try {
      const stored = localStorage.getItem(key);
      return options.includes(stored as T) ? (stored as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      current = undefined;
      listener();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  };

  const set = (value: T) => {
    current = value;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage can be blocked; the choice still applies for this visit.
    }
    for (const listener of listeners) listener();
  };

  return function useChoice() {
    const value = useSyncExternalStore(
      subscribe,
      () => (current ??= read()),
      () => fallback,
    );
    return [value, set] as const;
  };
}

export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];
export const usePackageManager = createChoice<PackageManager>('glyphfill:pm', PACKAGE_MANAGERS, 'npm');

export const installCommand = (pm: PackageManager) => (pm === 'npm' ? 'npm install glyphfill' : `${pm} add glyphfill`);

export const FRAMEWORKS = ['react', 'vue', 'svelte', 'js'] as const;
export type Framework = (typeof FRAMEWORKS)[number];
export const useFramework = createChoice<Framework>('glyphfill:framework', FRAMEWORKS, 'react');
