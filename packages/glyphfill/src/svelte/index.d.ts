import type { Component } from 'svelte';
import type { Action } from 'svelte/action';
import type { HTMLAttributes } from 'svelte/elements';
import type { GlyphFillOptions, VanillaOptions } from '../index.js';

export type { GlyphFillOptions, Mode, TooltipOption, VanillaOptions } from '../index.js';

export interface GlyphFillProps extends GlyphFillOptions, Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The word to render. */
  text: string;
}

/**
 * Shows progress inside a word. Renders on the server too.
 *
 * ```svelte
 * <GlyphFill value={40} text="USAGE" />
 * ```
 */
export declare const GlyphFill: Component<GlyphFillProps>;

/**
 * The same thing as an action, for an element you already have.
 *
 * ```svelte
 * <span use:glyphfill={{ value: 40 }}>USAGE</span>
 * ```
 */
export declare const glyphfill: Action<HTMLElement, VanillaOptions>;
