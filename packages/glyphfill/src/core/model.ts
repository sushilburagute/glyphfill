import {
  clampPercent,
  clampWeight,
  computeCoverage,
  computeWeight,
  DEFAULTS,
  type GlyphFillOptions,
  type Mode,
  tooltipText,
} from './compute';
import { graphemes } from './segment';

export interface Glyph {
  char: string;
  /** Font weight for this letter. */
  weight: number;
  /** How much of this letter is filled, 0–1. Drives `fillColor`. */
  t: number;
}

export type State = 'loading' | 'progress' | 'complete';

/**
 * Everything a renderer needs, independent of the DOM or a framework. The
 * vanilla, React, Vue and Svelte renderers all draw from this so their markup
 * stays identical.
 */
export interface GlyphFillModel {
  text: string;
  mode: Mode;
  state: State;
  /** Clamped percent; 0 while loading. */
  value: number;
  className: string;
  /** CSS custom properties for the root element. */
  vars: Record<`--gf-${string}`, string>;
  /** Attributes for the root element, in DOM (lowercase) spelling. */
  attrs: Record<string, string>;
  /** One entry per grapheme in sweep mode; empty otherwise. */
  glyphs: Glyph[];
}

export function createModel(text: string, options: GlyphFillOptions): GlyphFillModel {
  const mode = options.mode ?? DEFAULTS.mode;
  const loading = options.value == null;
  const value = loading ? 0 : clampPercent(options.value as number);
  const min = clampWeight(options.minWeight ?? DEFAULTS.minWeight);
  const max = clampWeight(options.maxWeight ?? DEFAULTS.maxWeight);
  const duration = Math.max(0, options.duration ?? DEFAULTS.duration);
  const tip = tooltipText(options.tooltip ?? DEFAULTS.tooltip, text, loading ? null : value);
  const rounded = Math.round(value);
  const state: State = loading ? 'loading' : value >= 100 ? 'complete' : 'progress';

  const attrs: Record<string, string> = {
    role: 'progressbar',
    'aria-label': text,
    'aria-valuemin': '0',
    'aria-valuemax': '100',
  };
  if (loading) {
    // An indeterminate progressbar has no aria-valuenow.
    attrs['aria-busy'] = 'true';
    attrs['aria-valuetext'] = `${text}, loading`;
  } else {
    attrs['aria-valuenow'] = String(rounded);
    attrs['aria-valuetext'] = `${text}, ${rounded}% completed`;
  }
  attrs['data-gf-mode'] = mode;
  attrs['data-gf-state'] = state;
  if (tip !== undefined) {
    attrs['data-gf-tip'] = tip;
    attrs.tabindex = '0';
  }

  const vars: GlyphFillModel['vars'] = {
    '--gf-pct': `${value}%`,
    '--gf-min': String(min),
    '--gf-max': String(max),
    '--gf-duration': `${duration}ms`,
  };
  if (mode === 'weight') vars['--gf-weight'] = String(computeWeight(value, min, max));
  if (options.fillColor) vars['--gf-fill'] = options.fillColor;

  let glyphs: Glyph[] = [];
  if (mode === 'sweep') {
    const chars = graphemes(text);
    const coverage = computeCoverage(chars.length, value);
    glyphs = chars.map((char, i) => {
      const t = coverage[i] ?? 0;
      return { char, t, weight: Math.round(min + (max - min) * t) };
    });
  }

  const className = loading ? `gf gf--${mode} gf--loading` : `gf gf--${mode}`;
  return { text, mode, state, value, className, vars, attrs, glyphs };
}
