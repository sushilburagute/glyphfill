'use client';

import type { Mode } from 'glyphfill/react';
import { GlyphFill } from 'glyphfill/react';
import { useState } from 'react';

const MODES: { mode: Mode; what: string }[] = [
  {
    mode: 'sweep',
    what: 'Letters before the progress point turn heavy and the rest stay thin. The letter on the edge sits between the two. This is the default.',
  },
  {
    mode: 'fill',
    what: 'Solid ink covers outlined letters from left to right and can stop partway through a letter. Works with any font.',
  },
  {
    mode: 'weight',
    what: 'The whole word gets heavier together. Best when the word itself matters more than where the progress is.',
  },
];

export function ModeCompare() {
  const [value, setValue] = useState(55);

  return (
    <>
      <label className="modes-slider">
        Progress
        <input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} />
        <output>{value}%</output>
      </label>
      <div className="modes">
        {MODES.map(({ mode, what }) => (
          <div className="mode" key={mode}>
            <p className="mode-demo">
              <GlyphFill value={value} mode={mode}>
                progress
              </GlyphFill>
            </p>
            <h3>
              <code>mode="{mode}"</code>
            </h3>
            <p className="mode-what">{what}</p>
          </div>
        ))}
      </div>
      <div className="modes modes-extra">
        <div className="mode">
          <p className="mode-demo">
            <GlyphFill value={value} fillColor="var(--marker)">
              progress
            </GlyphFill>
          </p>
          <h3>
            <code>fillColor</code>
          </h3>
          <p className="mode-what">
            Filled letters change to any CSS color, so a word can turn your brand color, or green as it nears 100%.
          </p>
        </div>
        <div className="mode">
          <p className="mode-demo">
            <GlyphFill>progress</GlyphFill>
          </p>
          <h3>No value yet</h3>
          <p className="mode-what">
            Leave out <code>value</code> while you wait for real numbers. A wave of weight moves through the word, and
            screen readers hear that it is loading.
          </p>
        </div>
      </div>
    </>
  );
}
