import { flushSync, mount, unmount } from 'svelte';
import { GlyphFill, glyphfill } from '../src/svelte/index.js';
import { reactive } from './props.svelte.js';

const weights = (el: Element) => Array.from(el.querySelectorAll<HTMLElement>('.gf__glyph'), (g) => g.style.fontWeight);

describe('GlyphFill (Svelte)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders sweep letters with no stray whitespace', () => {
    const target = document.createElement('div');
    const app = mount(GlyphFill, { target, props: { value: 40, text: 'USAGE', class: 'hero' } });
    const root = target.firstElementChild as HTMLElement;

    expect(root.className).toBe('gf gf--sweep hero');
    expect(root.getAttribute('aria-valuetext')).toBe('USAGE, 40% completed');
    expect(root.querySelector('.gf__text')?.textContent).toBe('USAGE');
    expect(weights(root)).toEqual(['900', '900', '100', '100', '100']);
    expect(root.style.getPropertyValue('--gf-pct')).toBe('40%');
    unmount(app);
  });

  it('keeps letter nodes across prop updates', () => {
    const target = document.createElement('div');
    const props = reactive({ value: 40, text: 'USAGE' });
    const app = mount(GlyphFill, { target, props });
    const before = target.querySelectorAll('.gf__glyph')[2];

    props.value = 60;
    flushSync();

    expect(target.querySelectorAll('.gf__glyph')[2]).toBe(before);
    expect(weights(target)).toEqual(['900', '900', '900', '100', '100']);
    unmount(app);
  });

  it('renders fill mode', () => {
    const target = document.createElement('div');
    const app = mount(GlyphFill, { target, props: { value: 40, mode: 'fill', text: 'USAGE' } });

    expect(target.querySelector('.gf__outline')?.textContent).toBe('USAGE');
    expect(target.querySelector('.gf__ink')?.textContent).toBe('USAGE');
    unmount(app);
  });

  it('exports the vanilla function as an action', () => {
    const el = document.createElement('span');
    el.textContent = 'USAGE';
    const action = glyphfill(el, { value: 40 });

    expect(el.querySelector('.gf')?.getAttribute('aria-valuenow')).toBe('40');
    action?.update?.({ value: 80 });
    expect(el.querySelector('.gf')?.getAttribute('aria-valuenow')).toBe('80');
    action?.destroy?.();
    expect(el.textContent).toBe('USAGE');
  });
});
