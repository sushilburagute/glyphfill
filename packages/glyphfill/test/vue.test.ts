import { createApp, defineComponent, h, nextTick, ref, type VNode } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { GlyphFill } from '../src/vue';

function mount(render: () => VNode) {
  const el = document.createElement('div');
  document.body.append(el);
  createApp(defineComponent({ render })).mount(el);
  return el;
}

const weights = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>('.gf__glyph'), (g) => g.style.fontWeight);

describe('GlyphFill (Vue)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the default slot as sweep letters', () => {
    const el = mount(() => h(GlyphFill, { value: 40 }, () => 'USAGE'));
    const root = el.firstElementChild as HTMLElement;

    expect(root.className).toBe('gf gf--sweep');
    expect(root.getAttribute('role')).toBe('progressbar');
    expect(root.getAttribute('aria-valuetext')).toBe('USAGE, 40% completed');
    expect(root.getAttribute('tabindex')).toBe('0');
    expect(weights(el)).toEqual(['900', '900', '100', '100', '100']);
  });

  it('falls class and style through to the root', () => {
    const el = mount(() => h(GlyphFill, { value: 40, class: 'hero', style: { color: 'red' } }, () => 'USAGE'));
    const root = el.firstElementChild as HTMLElement;

    expect(root.className).toBe('gf gf--sweep hero');
    expect(root.style.color).toBe('red');
    expect(root.style.getPropertyValue('--gf-pct')).toBe('40%');
  });

  it('keeps letter nodes across updates so weights animate', async () => {
    const value = ref(40);
    const el = mount(() => h(GlyphFill, { value: value.value }, () => 'USAGE'));
    const before = el.querySelectorAll('.gf__glyph')[2];

    value.value = 60;
    await nextTick();

    expect(el.querySelectorAll('.gf__glyph')[2]).toBe(before);
    expect(weights(el)).toEqual(['900', '900', '900', '100', '100']);
  });

  it('renders fill and weight modes, and loading', () => {
    const el = mount(() =>
      h('div', [
        h(GlyphFill, { value: 40, mode: 'fill', text: 'A' }),
        h(GlyphFill, { value: 40, mode: 'weight', text: 'B' }),
        h(GlyphFill, { text: 'C', tooltip: false }),
      ]),
    );
    const [fill, weight, loading] = Array.from(el.querySelectorAll<HTMLElement>('.gf'));

    expect(fill?.querySelector('.gf__ink')?.textContent).toBe('A');
    expect(weight?.style.getPropertyValue('--gf-weight')).toBe('420');
    expect(loading?.getAttribute('data-gf-state')).toBe('loading');
    expect(loading?.hasAttribute('tabindex')).toBe(false);
  });

  it('renders on the server', async () => {
    const html = await renderToString(
      createApp(defineComponent({ render: () => h(GlyphFill, { value: 40 }, () => 'USAGE') })),
    );

    expect(html).toContain('class="gf gf--sweep"');
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain('font-weight:900');
  });
});
