import { clampPercent, computeWeight, computeWeights, tooltipText } from '../src/core/compute';
import { graphemes } from '../src/core/segment';

describe('computeWeights', () => {
  it('fills nothing at 0%', () => {
    expect(computeWeights(5, 0)).toEqual([100, 100, 100, 100, 100]);
  });

  it('fills the first two of five letters at 40%, like the sketch', () => {
    expect(computeWeights(5, 40)).toEqual([900, 900, 100, 100, 100]);
  });

  it('puts the boundary letter between min and max', () => {
    expect(computeWeights(5, 50)).toEqual([900, 900, 500, 100, 100]);
  });

  it('fills everything at 100%', () => {
    expect(computeWeights(5, 100)).toEqual([900, 900, 900, 900, 900]);
  });

  it('clamps out-of-range values', () => {
    expect(computeWeights(3, -20)).toEqual([100, 100, 100]);
    expect(computeWeights(3, 250)).toEqual([900, 900, 900]);
    expect(computeWeights(3, Number.NaN)).toEqual([100, 100, 100]);
  });

  it('handles a single letter', () => {
    expect(computeWeights(1, 25)).toEqual([300]);
  });

  it('respects custom weights', () => {
    expect(computeWeights(2, 50, 300, 700)).toEqual([700, 300]);
  });

  it('returns nothing for empty text', () => {
    expect(computeWeights(0, 50)).toEqual([]);
  });
});

describe('computeWeight', () => {
  it('interpolates the whole-word weight', () => {
    expect(computeWeight(0)).toBe(100);
    expect(computeWeight(40)).toBe(420);
    expect(computeWeight(100)).toBe(900);
  });
});

describe('clampPercent', () => {
  it('keeps values in [0, 100]', () => {
    expect(clampPercent(42.5)).toBe(42.5);
    expect(clampPercent(-1)).toBe(0);
    expect(clampPercent(101)).toBe(100);
    expect(clampPercent(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('tooltipText', () => {
  it('defaults to "WORD · N% completed"', () => {
    expect(tooltipText(true, 'USAGE', 40)).toBe('USAGE · 40% completed');
    expect(tooltipText(true, 'USAGE', 39.6)).toBe('USAGE · 40% completed');
  });

  it('accepts a string, a function, or false', () => {
    expect(tooltipText('hi', 'USAGE', 40)).toBe('hi');
    expect(tooltipText((w, p) => `${p}/${w}`, 'USAGE', 40)).toBe('40/USAGE');
    expect(tooltipText(false, 'USAGE', 40)).toBeUndefined();
  });
});

describe('graphemes', () => {
  it('splits plain text into letters', () => {
    expect(graphemes('USAGE')).toEqual(['U', 'S', 'A', 'G', 'E']);
  });

  it('keeps combining marks and emoji sequences whole', () => {
    expect(graphemes('café')).toEqual(['c', 'a', 'f', 'é']);
    expect(graphemes('ok\u{1F44D}\u{1F3FD}')).toEqual(['o', 'k', '\u{1F44D}\u{1F3FD}']);
    expect(graphemes('\u{1F468}‍\u{1F469}‍\u{1F467}')).toHaveLength(1);
  });
});
