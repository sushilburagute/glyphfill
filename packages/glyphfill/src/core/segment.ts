let segmenter: Intl.Segmenter | undefined;

/** Split text into user-perceived characters, so "é" or "👍🏽" stay whole. */
export function graphemes(text: string): string[] {
  if (typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') {
    return Array.from(text);
  }
  segmenter ??= new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  return Array.from(segmenter.segment(text), (s) => s.segment);
}
