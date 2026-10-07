import { type CSSProperties, forwardRef, type HTMLAttributes } from 'react';
import type { GlyphFillOptions } from '../core/compute';
import { createModel } from '../core/model';

type TextChild = string | number;

export interface GlyphFillProps extends GlyphFillOptions, Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The word to render. Must be text: `{word}` and `{word} done` both work. */
  children: TextChild | TextChild[];
}

const toText = (children: TextChild | TextChild[]) => (Array.isArray(children) ? children.join('') : String(children));

/**
 * Shows progress inside a word. Has no hooks or effects, so it renders the
 * same on the server and works as a React Server Component. Forwards its ref
 * and merges `className`/`style`, so `asChild`, `styled()`, `chakra()` and
 * `motion()` wrappers work.
 */
export const GlyphFill = forwardRef<HTMLSpanElement, GlyphFillProps>(function GlyphFill(
  { value, mode, minWeight, maxWeight, duration, tooltip, fillColor, children, className, style, ...rest },
  ref,
) {
  const model = createModel(toText(children), { value, mode, minWeight, maxWeight, duration, tooltip, fillColor });
  const { tabindex, ...attrs } = model.attrs;

  return (
    <span
      {...attrs}
      tabIndex={tabindex === undefined ? undefined : Number(tabindex)}
      {...rest}
      ref={ref}
      className={className ? `${model.className} ${className}` : model.className}
      style={{ ...(model.vars as CSSProperties), ...style }}
    >
      {model.mode === 'fill' ? (
        <>
          <span className="gf__outline" aria-hidden="true">
            {model.text}
          </span>
          <span className="gf__ink" aria-hidden="true">
            {model.text}
          </span>
        </>
      ) : (
        <>
          <span className="gf__ghost" aria-hidden="true">
            {model.text}
          </span>
          <span className="gf__text" aria-hidden="true">
            {model.mode === 'sweep'
              ? model.glyphs.map((glyph, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: letters are positional; stable index keys let weights animate
                    key={i}
                    className="gf__glyph"
                    style={{ fontWeight: glyph.weight, '--gf-t': glyph.t, '--gf-i': i } as CSSProperties}
                  >
                    {glyph.char}
                  </span>
                ))
              : model.text}
          </span>
        </>
      )}
    </span>
  );
});
