import { glyphfill } from '../src';

function mount(text: string) {
  const el = document.createElement('h1');
  el.textContent = text;
  document.body.append(el);
  return el;
}

const root = (el: HTMLElement) => el.firstElementChild as HTMLElement;
const weights = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>('.gf__glyph'), (g) => g.style.fontWeight);

describe('glyphfill (vanilla)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders sweep mode by default with per-letter weights', () => {
    const el = mount('USAGE');
    glyphfill(el, { value: 40 });

    expect(root(el).className).toBe('gf gf--sweep');
    expect(weights(el)).toEqual(['900', '900', '100', '100', '100']);
    expect(el.querySelector('.gf__ghost')?.textContent).toBe('USAGE');
  });

  it('sets progressbar semantics and the tooltip', () => {
    const el = mount('USAGE');
    glyphfill(el, { value: 40 });
    const r = root(el);

    expect(r.getAttribute('role')).toBe('progressbar');
    expect(r.getAttribute('aria-valuenow')).toBe('40');
    expect(r.getAttribute('aria-valuetext')).toBe('USAGE, 40% completed');
    expect(r.getAttribute('data-gf-tip')).toBe('USAGE · 40% completed');
    expect(r.getAttribute('tabindex')).toBe('0');
    expect(r.style.getPropertyValue('--gf-pct')).toBe('40%');
    for (const child of Array.from(r.children)) {
      expect(child.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('updates weights in place so letters can animate', () => {
    const el = mount('USAGE');
    const gf = glyphfill(el, { value: 40 });
    const before = el.querySelectorAll('.gf__glyph')[2];

    gf.update({ value: 60 });

    expect(weights(el)).toEqual(['900', '900', '900', '100', '100']);
    expect(el.querySelectorAll('.gf__glyph')[2]).toBe(before);
    expect(root(el).getAttribute('aria-valuenow')).toBe('60');
  });

  it('removes the tooltip and tab stop when tooltip is turned off', () => {
    const el = mount('USAGE');
    const gf = glyphfill(el, { value: 40 });
    gf.update({ tooltip: false });

    expect(root(el).hasAttribute('data-gf-tip')).toBe(false);
    expect(root(el).hasAttribute('tabindex')).toBe(false);
  });

  it('switches modes and text', () => {
    const el = mount('USAGE');
    const gf = glyphfill(el, { value: 40 });

    gf.update({ mode: 'fill' });
    expect(root(el).className).toBe('gf gf--fill');
    expect(el.querySelector('.gf__outline')?.textContent).toBe('USAGE');
    expect(el.querySelector('.gf__ink')?.textContent).toBe('USAGE');
    expect(el.querySelector('.gf__glyph')).toBeNull();

    gf.update({ mode: 'weight', text: 'DONE' });
    expect(root(el).style.getPropertyValue('--gf-weight')).toBe('420');
    expect(el.querySelector('.gf__text')?.textContent).toBe('DONE');

    gf.update({ mode: 'sweep' });
    expect(root(el).style.getPropertyValue('--gf-weight')).toBe('');
  });

  it('restores the original content on destroy', () => {
    const el = mount('USAGE');
    const text = el.firstChild;
    const gf = glyphfill(el, { value: 40 });
    gf.destroy();

    expect(el.childNodes).toHaveLength(1);
    expect(el.firstChild).toBe(text);
  });
});
