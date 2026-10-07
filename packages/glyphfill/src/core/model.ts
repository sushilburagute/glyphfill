import {
  clampPercent,
  clampWeight,
  computeWeight,
  computeWeights,
  DEFAULTS,
  type GlyphFillOptions,
  type Mode,
  tooltipText,
} from './compute';
import { graphemes } from './segment';

export interface Glyph {
  char: string;
  weight: number;
}

/**
 * Everything a renderer needs, independent of the DOM or React. Both the
 * vanilla and React renderers draw from this so their markup stays identical.
 */
export interface GlyphFillModel {
  text: string;
  mode: Mode;
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
  const value = clampPercent(options.value);
  const min = clampWeight(options.minWeight ?? DEFAULTS.minWeight);
  const max = clampWeight(options.maxWeight ?? DEFAULTS.maxWeight);
  const duration = Math.max(0, options.duration ?? DEFAULTS.duration);
  const tip = tooltipText(options.tooltip ?? DEFAULTS.tooltip, text, value);
  const rounded = Math.round(value);

  const attrs: Record<string, string> = {
    role: 'progressbar',
    'aria-label': text,
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    'aria-valuenow': String(rounded),
    'aria-valuetext': `${text}, ${rounded}% completed`,
  };
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

  let glyphs: Glyph[] = [];
  if (mode === 'sweep') {
    const chars = graphemes(text);
    const weights = computeWeights(chars.length, value, min, max);
    glyphs = chars.map((char, i) => ({ char, weight: weights[i] ?? min }));
  }

  return { text, mode, value, className: `gf gf--${mode}`, vars, attrs, glyphs };
}
