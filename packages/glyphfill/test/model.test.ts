import { createModel } from '../src/core/model';

describe('createModel', () => {
  it('marks progress and completion in data-state', () => {
    expect(createModel('USAGE', { value: 40 }).attrs['data-gf-state']).toBe('progress');
    expect(createModel('USAGE', { value: 100 }).attrs['data-gf-state']).toBe('complete');
    expect(createModel('USAGE', { value: 40, mode: 'fill' }).attrs['data-gf-mode']).toBe('fill');
  });

  it('treats a missing or null value as loading', () => {
    for (const value of [undefined, null]) {
      const model = createModel('USAGE', { value });
      expect(model.state).toBe('loading');
      expect(model.className).toBe('gf gf--sweep gf--loading');
      expect(model.attrs['aria-busy']).toBe('true');
      expect(model.attrs['aria-valuenow']).toBeUndefined();
      expect(model.attrs['aria-valuetext']).toBe('USAGE, loading');
      expect(model.attrs['data-gf-tip']).toBe('USAGE · loading');
    }
  });

  it('passes null to a tooltip function while loading', () => {
    const model = createModel('USAGE', { tooltip: (w, p) => (p === null ? `${w} soon` : `${w} ${p}`) });
    expect(model.attrs['data-gf-tip']).toBe('USAGE soon');
  });

  it('exposes per-letter coverage for color fills', () => {
    const model = createModel('USAGE', { value: 50, fillColor: 'green' });
    expect(model.glyphs.map((g) => g.t)).toEqual([1, 1, 0.5, 0, 0]);
    expect(model.vars['--gf-fill']).toBe('green');
  });

  it('leaves --gf-fill unset without a fillColor', () => {
    expect(createModel('USAGE', { value: 50 }).vars['--gf-fill']).toBeUndefined();
  });
});
