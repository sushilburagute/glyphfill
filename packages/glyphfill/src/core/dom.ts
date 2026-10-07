import type { GlyphFillOptions } from './compute';
import { createModel, type Glyph, type GlyphFillModel } from './model';

export interface VanillaOptions extends GlyphFillOptions {
  /** Text to render. Defaults to the element's text content at mount time. */
  text?: string;
}

export interface GlyphFillInstance {
  /** Merge new options and re-render. Unchanged letters keep their nodes, so weights animate. */
  update(options: Partial<VanillaOptions>): void;
  /** Restore the element's original content. */
  destroy(): void;
}

function span(doc: Document, className: string, text?: string): HTMLSpanElement {
  const el = doc.createElement('span');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  if (text !== undefined) el.textContent = text;
  return el;
}

function styleGlyph(node: HTMLElement, glyph: Glyph, i: number) {
  node.style.fontWeight = String(glyph.weight);
  node.style.setProperty('--gf-t', String(glyph.t));
  node.style.setProperty('--gf-i', String(i));
}

function buildChildren(doc: Document, model: GlyphFillModel): HTMLSpanElement[] {
  if (model.mode === 'fill') {
    return [span(doc, 'gf__outline', model.text), span(doc, 'gf__ink', model.text)];
  }
  const text = span(doc, 'gf__text');
  if (model.mode === 'sweep') {
    model.glyphs.forEach((glyph, i) => {
      const g = doc.createElement('span');
      g.className = 'gf__glyph';
      styleGlyph(g, glyph, i);
      g.textContent = glyph.char;
      text.append(g);
    });
  } else {
    text.textContent = model.text;
  }
  return [span(doc, 'gf__ghost', model.text), text];
}

/**
 * Render `el`'s text as a glyphfill progress indicator. The `(el, options)`
 * signature and `{ update, destroy }` return also make this a Svelte action.
 */
export function glyphfill(el: HTMLElement, options: VanillaOptions): GlyphFillInstance {
  const doc = el.ownerDocument;
  const original = Array.from(el.childNodes);
  const initialText = el.textContent ?? '';
  const root = doc.createElement('span');
  let opts: VanillaOptions = { ...options };
  let attrKeys: string[] = [];
  let varKeys: string[] = [];
  let layoutKey: string | undefined;

  function render() {
    const model = createModel(opts.text ?? initialText, opts);

    root.className = model.className;
    for (const key of attrKeys) if (!(key in model.attrs)) root.removeAttribute(key);
    for (const [key, val] of Object.entries(model.attrs)) root.setAttribute(key, val);
    attrKeys = Object.keys(model.attrs);
    for (const key of varKeys) if (!(key in model.vars)) root.style.removeProperty(key);
    for (const [key, val] of Object.entries(model.vars)) root.style.setProperty(key, val);
    varKeys = Object.keys(model.vars);

    const key = `${model.mode}\u0000${model.text}`;
    if (key !== layoutKey) {
      root.replaceChildren(...buildChildren(doc, model));
      layoutKey = key;
    } else if (model.mode === 'sweep') {
      const nodes = root.querySelectorAll<HTMLElement>('.gf__glyph');
      model.glyphs.forEach((glyph, i) => {
        const node = nodes[i];
        if (node) styleGlyph(node, glyph, i);
      });
    }
  }

  render();
  el.replaceChildren(root);

  return {
    update(next) {
      opts = { ...opts, ...next };
      render();
    },
    destroy() {
      el.replaceChildren(...original);
    },
  };
}
