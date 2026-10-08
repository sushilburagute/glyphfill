'use client';

import { GlyphFill } from 'glyphfill/react';
import { MoveHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

const START = 40;

export function HeroWord() {
  const [value, setValue] = useState(0);
  const [touched, setTouched] = useState(false);

  // One entrance: sweep from 0 to 40% after the first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() => setValue(START));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <div className="hero-word">
        <GlyphFill value={value} duration={touched ? 90 : 1100} tooltip={false} aria-hidden="true">
          glyphfill
        </GlyphFill>
        <input
          className="hero-range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          aria-label="Progress of the word glyphfill"
          aria-valuetext={`${value}% completed`}
          onChange={(e) => {
            setTouched(true);
            setValue(Number(e.target.value));
          }}
        />
      </div>
      <div className="hero-meta">
        <span className="hero-readout">{value}% completed</span>
        <span className="hint">
          <MoveHorizontal />
          Drag across the word to change it.
        </span>
      </div>
    </>
  );
}
