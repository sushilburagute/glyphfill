import { render } from '@testing-library/react';
import { GlyphFill } from '../src/react';

const weights = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('.gf__glyph'), (g) => g.style.fontWeight);

describe('<GlyphFill>', () => {
  it('renders sweep mode with per-letter weights', () => {
    const { container } = render(<GlyphFill value={40}>USAGE</GlyphFill>);

    expect(container.firstElementChild?.className).toBe('gf gf--sweep');
    expect(weights(container)).toEqual(['900', '900', '100', '100', '100']);
  });

  it('exposes a progressbar with an accessible value', () => {
    const { getByRole } = render(<GlyphFill value={40}>USAGE</GlyphFill>);
    const bar = getByRole('progressbar', { name: 'USAGE' });

    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(bar.getAttribute('aria-valuetext')).toBe('USAGE, 40% completed');
    expect(bar.getAttribute('data-gf-tip')).toBe('USAGE · 40% completed');
    expect(bar.tabIndex).toBe(0);
  });

  it('renders fill mode as outline and ink layers', () => {
    const { container } = render(
      <GlyphFill value={40} mode="fill">
        USAGE
      </GlyphFill>,
    );

    expect(container.querySelector('.gf__outline')?.textContent).toBe('USAGE');
    expect(container.querySelector('.gf__ink')?.textContent).toBe('USAGE');
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--gf-pct')).toBe('40%');
  });

  it('renders weight mode with one interpolated weight', () => {
    const { container } = render(
      <GlyphFill value={40} mode="weight">
        USAGE
      </GlyphFill>,
    );

    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--gf-weight')).toBe('420');
    expect(container.querySelector('.gf__glyph')).toBeNull();
  });

  it('accepts custom tooltips, mixed text children, and passthrough props', () => {
    const word = 'USAGE';
    const { getByRole } = render(
      <GlyphFill value={40} tooltip={(w, p) => `${w}: ${p}%`} className="hero" id="usage">
        {word} today
      </GlyphFill>,
    );
    const bar = getByRole('progressbar');

    expect(bar.getAttribute('data-gf-tip')).toBe('USAGE today: 40%');
    expect(bar.className).toBe('gf gf--sweep hero');
    expect(bar.id).toBe('usage');
  });

  it('drops the tooltip and tab stop when tooltip is false', () => {
    const { getByRole } = render(
      <GlyphFill value={40} tooltip={false}>
        USAGE
      </GlyphFill>,
    );
    const bar = getByRole('progressbar');

    expect(bar.hasAttribute('data-gf-tip')).toBe(false);
    expect(bar.hasAttribute('tabindex')).toBe(false);
  });

  it('keeps letter nodes across value changes so weights animate', () => {
    const { container, rerender } = render(<GlyphFill value={40}>USAGE</GlyphFill>);
    const before = container.querySelectorAll('.gf__glyph')[2];

    rerender(<GlyphFill value={60}>USAGE</GlyphFill>);

    expect(container.querySelectorAll('.gf__glyph')[2]).toBe(before);
    expect(weights(container)).toEqual(['900', '900', '900', '100', '100']);
  });
});
