<script>
// Plain JS so consumers compile it without a TypeScript preprocessor.
import { createModel } from '../index.js';

/** @type {import('./index').GlyphFillProps} */
let {
  text,
  value,
  mode,
  minWeight,
  maxWeight,
  duration,
  tooltip,
  fillColor,
  class: className = '',
  style = '',
  ...rest
} = $props();

const model = $derived(createModel(text, { value, mode, minWeight, maxWeight, duration, tooltip, fillColor }));
const vars = $derived(
  Object.entries(model.vars)
    .map(([key, val]) => `${key}: ${val}`)
    .join('; '),
);
</script>

<!-- Kept on one line: whitespace between letter spans would render as spaces. -->
<span
  {...model.attrs}
  {...rest}
  class={className ? `${model.className} ${className}` : model.className}
  style={style ? `${vars}; ${style}` : vars}
>{#if model.mode === 'fill'}<span class="gf__outline" aria-hidden="true">{model.text}</span><span class="gf__ink" aria-hidden="true">{model.text}</span>{:else}<span class="gf__ghost" aria-hidden="true">{model.text}</span><span class="gf__text" aria-hidden="true">{#if model.mode === 'sweep'}{#each model.glyphs as glyph, i (i)}<span class="gf__glyph" style:font-weight={glyph.weight} style:--gf-t={glyph.t} style:--gf-i={i}>{glyph.char}</span>{/each}{:else}{model.text}{/if}</span>{/if}</span>
