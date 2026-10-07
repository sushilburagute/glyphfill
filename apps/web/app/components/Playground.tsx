'use client';

import type { Mode } from 'glyphfill/react';
import { GlyphFill } from 'glyphfill/react';
import { useId, useState } from 'react';
import { CodeBlock } from './CopyButton';

const FONTS = [
  { label: 'Big Shoulders', css: 'var(--font-display)', note: '100–900' },
  { label: 'Fraunces', css: 'var(--font-fraunces)', note: '100–900' },
  { label: 'Inter', css: 'var(--font-inter)', note: '100–900' },
  { label: 'Recursive', css: 'var(--font-text)', note: '300–1000' },
] as const;

const MODES: Mode[] = ['sweep', 'fill', 'weight'];

interface State {
  word: string;
  value: number;
  mode: Mode;
  font: number;
  minWeight: number;
  maxWeight: number;
  duration: number;
  showTooltip: boolean;
  tooltipText: string;
}

const INITIAL: State = {
  word: 'USAGE',
  value: 40,
  mode: 'sweep',
  font: 0,
  minWeight: 100,
  maxWeight: 900,
  duration: 300,
  showTooltip: true,
  tooltipText: '',
};

function jsxText(word: string) {
  return /[{}<>]/.test(word) ? `{${JSON.stringify(word)}}` : word;
}

function reactSnippet(s: State) {
  const props = [`value={${s.value}}`];
  if (s.mode !== 'sweep') props.push(`mode="${s.mode}"`);
  if (s.minWeight !== 100) props.push(`minWeight={${s.minWeight}}`);
  if (s.maxWeight !== 900) props.push(`maxWeight={${s.maxWeight}}`);
  if (s.duration !== 300) props.push(`duration={${s.duration}}`);
  if (!s.showTooltip) props.push('tooltip={false}');
  else if (s.tooltipText) props.push(`tooltip=${JSON.stringify(s.tooltipText)}`);

  return [
    "import { GlyphFill } from 'glyphfill/react';",
    "import 'glyphfill/styles.css';",
    '',
    `<GlyphFill ${props.join(' ')}>${jsxText(s.word)}</GlyphFill>`,
  ].join('\n');
}

function vanillaSnippet(s: State) {
  const opts = [`value: ${s.value}`];
  if (s.mode !== 'sweep') opts.push(`mode: '${s.mode}'`);
  if (s.minWeight !== 100) opts.push(`minWeight: ${s.minWeight}`);
  if (s.maxWeight !== 900) opts.push(`maxWeight: ${s.maxWeight}`);
  if (s.duration !== 300) opts.push(`duration: ${s.duration}`);
  if (!s.showTooltip) opts.push('tooltip: false');
  else if (s.tooltipText) opts.push(`tooltip: ${JSON.stringify(s.tooltipText)}`);

  return [
    "import { glyphfill } from 'glyphfill';",
    "import 'glyphfill/styles.css';",
    '',
    `// <span id="word">${s.word}</span>`,
    `const word = glyphfill(document.getElementById('word'), { ${opts.join(', ')} });`,
    '',
    '// later, as the task progresses',
    'word.update({ value: 75 });',
  ].join('\n');
}

export function Playground() {
  const [s, setS] = useState<State>(INITIAL);
  const [tab, setTab] = useState<'react' | 'js'>('react');
  const id = useId();
  const set = <K extends keyof State>(key: K, value: State[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const font = FONTS[s.font] ?? FONTS[0];

  return (
    <div className="playground">
      <form className="controls" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label className="field-label" htmlFor={`${id}-word`}>
            Word
          </label>
          <input
            id={`${id}-word`}
            className="input"
            value={s.word}
            maxLength={40}
            onChange={(e) => set('word', e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor={`${id}-value`}>
            Progress <span className="field-value">{s.value}%</span>
          </label>
          <input
            id={`${id}-value`}
            type="range"
            min={0}
            max={100}
            value={s.value}
            onChange={(e) => set('value', Number(e.target.value))}
          />
        </div>

        <fieldset className="field">
          <legend className="field-label">Mode</legend>
          <div className="segmented">
            {MODES.map((mode) => (
              <label key={mode}>
                <input
                  type="radio"
                  name={`${id}-mode`}
                  value={mode}
                  checked={s.mode === mode}
                  onChange={() => set('mode', mode)}
                />
                {mode[0]?.toUpperCase()}
                {mode.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label className="field-label" htmlFor={`${id}-font`}>
            Font <span className="field-value">weights {font.note}</span>
          </label>
          <select
            id={`${id}-font`}
            className="select"
            value={s.font}
            onChange={(e) => set('font', Number(e.target.value))}
          >
            {FONTS.map((f, i) => (
              <option key={f.label} value={i}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pair">
          <div className="field">
            <label className="field-label" htmlFor={`${id}-min`}>
              Min weight <span className="field-value">{s.minWeight}</span>
            </label>
            <input
              id={`${id}-min`}
              type="range"
              min={100}
              max={1000}
              step={50}
              value={s.minWeight}
              onChange={(e) => set('minWeight', Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor={`${id}-max`}>
              Max weight <span className="field-value">{s.maxWeight}</span>
            </label>
            <input
              id={`${id}-max`}
              type="range"
              min={100}
              max={1000}
              step={50}
              value={s.maxWeight}
              onChange={(e) => set('maxWeight', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor={`${id}-duration`}>
            Transition <span className="field-value">{s.duration} ms</span>
          </label>
          <input
            id={`${id}-duration`}
            type="range"
            min={0}
            max={1500}
            step={50}
            value={s.duration}
            onChange={(e) => set('duration', Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label className="check">
            <input type="checkbox" checked={s.showTooltip} onChange={(e) => set('showTooltip', e.target.checked)} />
            Show tooltip on hover and focus
          </label>
          <input
            className="input"
            aria-label="Tooltip text"
            placeholder={`${s.word} · ${s.value}% completed`}
            value={s.tooltipText}
            disabled={!s.showTooltip}
            onChange={(e) => set('tooltipText', e.target.value)}
          />
        </div>

        <button type="button" className="button" onClick={() => setS(INITIAL)}>
          Reset
        </button>
      </form>

      <div>
        <div className="stage" style={{ fontFamily: font.css }}>
          <GlyphFill
            value={s.value}
            mode={s.mode}
            minWeight={s.minWeight}
            maxWeight={s.maxWeight}
            duration={s.duration}
            tooltip={s.showTooltip ? s.tooltipText || true : false}
          >
            {s.word || ' '}
          </GlyphFill>
        </div>

        <div className="tabs" role="tablist" aria-label="Code">
          <button
            type="button"
            role="tab"
            className="tab"
            aria-selected={tab === 'react'}
            onClick={() => setTab('react')}
          >
            React
          </button>
          <button type="button" role="tab" className="tab" aria-selected={tab === 'js'} onClick={() => setTab('js')}>
            JavaScript
          </button>
        </div>
        <CodeBlock code={tab === 'react' ? reactSnippet(s) : vanillaSnippet(s)} />
      </div>
    </div>
  );
}
