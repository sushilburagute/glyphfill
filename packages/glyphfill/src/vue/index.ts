import { defineComponent, h, type PropType, type VNode } from 'vue';
import type { Mode, TooltipOption } from '../core/compute';
import { createModel } from '../core/model';

export type { GlyphFillOptions, Mode, TooltipOption } from '../core/compute';

/** Text of the default slot: plain text and `{{ interpolations }}`, flattened. */
function slotText(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(slotText).join('');
  if (node && typeof node === 'object' && 'children' in node) return slotText((node as VNode).children);
  return '';
}

/**
 * Shows progress inside a word.
 *
 * ```vue
 * <GlyphFill :value="40">USAGE</GlyphFill>
 * ```
 *
 * `class`, `style` and listeners fall through to the outer `<span>`.
 */
export const GlyphFill = defineComponent({
  name: 'GlyphFill',
  props: {
    value: { type: Number as PropType<number | null>, default: undefined },
    mode: { type: String as PropType<Mode>, default: undefined },
    minWeight: { type: Number, default: undefined },
    maxWeight: { type: Number, default: undefined },
    duration: { type: Number, default: undefined },
    tooltip: { type: [Boolean, String, Function] as PropType<TooltipOption>, default: true },
    fillColor: { type: String, default: undefined },
    /** The word to render. Defaults to the default slot's text. */
    text: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () => {
      const text = props.text ?? slotText(slots.default?.());
      const model = createModel(text, props);
      const hidden = { 'aria-hidden': 'true' };

      const children =
        model.mode === 'fill'
          ? [
              h('span', { class: 'gf__outline', ...hidden }, model.text),
              h('span', { class: 'gf__ink', ...hidden }, model.text),
            ]
          : [
              h('span', { class: 'gf__ghost', ...hidden }, model.text),
              h(
                'span',
                { class: 'gf__text', ...hidden },
                model.mode === 'sweep'
                  ? model.glyphs.map((glyph, i) =>
                      h(
                        'span',
                        {
                          key: i,
                          class: 'gf__glyph',
                          style: { fontWeight: glyph.weight, '--gf-t': glyph.t, '--gf-i': i },
                        },
                        glyph.char,
                      ),
                    )
                  : model.text,
              ),
            ];

      return h('span', { ...model.attrs, class: model.className, style: model.vars }, children);
    };
  },
});
