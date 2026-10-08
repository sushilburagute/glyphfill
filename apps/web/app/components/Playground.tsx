'use client';

import type { Mode } from 'glyphfill/react';
import { GlyphFill } from 'glyphfill/react';
import { RotateCcw } from 'lucide-react';
import { useId, useState } from 'react';
import { type CodeTab, CodeTabs } from './CodeTabs';

const FONTS = [
  { label: 'Big Shoulders', css: 'var(--font-display)', note: '100–900' },
  { label: 'Bricolage Grotesque', css: 'var(--font-text)', note: '200–800' },
  { label: 'Fraunces', css: 'var(--font-fraunces)', note: '100–900' },
  { label: 'Inter', css: 'var(--font-inter)', note: '100–900' },
] as const;

const MODES: Mode[] = ['sweep', 'fill', 'weight'];

interface State {
  word: string;
  value: number;
  loading: boolean;
  mode: Mode;
  font: number;
  minWeight: number;
  maxWeight: number;
  duration: number;
  useFill: boolean;
  fillColor: string;
  showTooltip: boolean;
  tooltipText: string;
}

const INITIAL: State = {
  word: 'USAGE',
  value: 40,
  loading: false,
  mode: 'sweep',
  font: 0,
  minWeight: 100,
  maxWeight: 900,
  duration: 300,
  useFill: false,
  fillColor: '#f2553d',
  showTooltip: true,
  tooltipText: '',
};

type Opt = [name: string, value: string | number | boolean];

/** Options that differ from the defaults, in the order people read them. */
function changedOptions(s: State): Opt[] {
  const opts: Opt[] = [];
  if (!s.loading) opts.push(['value', s.value]);
  if (s.mode !== 'sweep') opts.push(['mode', s.mode]);
  if (s.minWeight !== 100) opts.push(['minWeight', s.minWeight]);
  if (s.maxWeight !== 900) opts.push(['maxWeight', s.maxWeight]);
  if (s.duration !== 300) opts.push(['duration', s.duration]);
  if (s.useFill) opts.push(['fillColor', s.fillColor]);
  if (!s.showTooltip) opts.push(['tooltip', false]);
  else if (s.tooltipText) opts.push(['tooltip', s.tooltipText]);
  return opts;
}

const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const jsxAttr = ([name, v]: Opt) =>
  typeof v === 'string' && !v.includes('"')
    ? `${name}="${v}"`
    : `${name}={${typeof v === 'string' ? JSON.stringify(v) : v}}`;
const vueAttr = ([name, v]: Opt) =>
  typeof v === 'string' ? `${kebab(name)}="${v.replace(/"/g, '&quot;')}"` : `:${kebab(name)}="${v}"`;
const jsProp = ([name, v]: Opt) => `${name}: ${typeof v === 'string' ? JSON.stringify(v) : v}`;

/** One line when short, one attribute per line when long. */
function tag(open: string, attrs: string[], close: string, indent = '') {
  const inline = `${open}${attrs.length ? ` ${attrs.join(' ')}` : ''}${close}`;
  if (inline.length <= 72) return indent + inline;
  return [`${indent}${open}`, ...attrs.map((a) => `${indent}  ${a}`), `${indent}${close.trimStart()}`].join('\n');
}

function snippets(s: State): CodeTab[] {
  const opts = changedOptions(s);
  const word = s.word || 'USAGE';
  const jsxWord = /[{}<>]/.test(word) ? `{${JSON.stringify(word)}}` : word;

  const react = [
    "import { GlyphFill } from 'glyphfill/react';",
    "import 'glyphfill/styles.css';",
    '',
    tag('<GlyphFill', opts.map(jsxAttr), `>${jsxWord}</GlyphFill>`),
  ].join('\n');

  const vue = [
    '<script setup>',
    "import { GlyphFill } from 'glyphfill/vue';",
    "import 'glyphfill/styles.css';",
    '</script>',
    '',
    '<template>',
    tag('<GlyphFill', opts.map(vueAttr), `>${word.replace(/[{}<>]/g, '')}</GlyphFill>`, '  '),
    '</template>',
  ].join('\n');

  const svelte = [
    '<script>',
    "  import { GlyphFill } from 'glyphfill/svelte';",
    "  import 'glyphfill/styles.css';",
    '</script>',
    '',
    tag('<GlyphFill', [...opts.map(jsxAttr), jsxAttr(['text', word])], ' />'),
  ].join('\n');

  const js = [
    "import { glyphfill } from 'glyphfill';",
    "import 'glyphfill/styles.css';",
    '',
    `// <span id="word">${word}</span>`,
    `const word = glyphfill(document.getElementById('word'), { ${opts.map(jsProp).join(', ')} });`,
    '',
    s.loading ? '// once progress is known' : '// later, as the task progresses',
    'word.update({ value: 75 });',
  ].join('\n');

  return [
    { id: 'react', label: 'React', blocks: [{ code: react }] },
    { id: 'vue', label: 'Vue', blocks: [{ code: vue }] },
    { id: 'svelte', label: 'Svelte', blocks: [{ code: svelte }] },
    { id: 'js', label: 'JavaScript', blocks: [{ code: js }] },
  ];
}

export function Playground() {
  const [s, setS] = useState<State>(INITIAL);
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
            Progress <span className="field-value">{s.loading ? 'loading' : `${s.value}%`}</span>
          </label>
          <input
            id={`${id}-value`}
            type="range"
            min={0}
            max={100}
            value={s.value}
            disabled={s.loading}
            onChange={(e) => set('value', Number(e.target.value))}
          />
          <label className="check">
            <input type="checkbox" checked={s.loading} onChange={(e) => set('loading', e.target.checked)} />
            Not known yet (show loading)
          </label>
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
          <div className="check-row">
            <label className="check">
              <input type="checkbox" checked={s.useFill} onChange={(e) => set('useFill', e.target.checked)} />
              Color the filled letters
            </label>
            <input
              type="color"
              className="swatch"
              aria-label="Fill color"
              value={s.fillColor}
              disabled={!s.useFill}
              onChange={(e) => set('fillColor', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="check">
            <input type="checkbox" checked={s.showTooltip} onChange={(e) => set('showTooltip', e.target.checked)} />
            Show tooltip on hover and focus
          </label>
          <input
            className="input"
            aria-label="Tooltip text"
            placeholder={`${s.word} · ${s.loading ? 'loading' : `${s.value}% completed`}`}
            value={s.tooltipText}
            disabled={!s.showTooltip}
            onChange={(e) => set('tooltipText', e.target.value)}
          />
        </div>

        <button type="button" className="button" onClick={() => setS(INITIAL)}>
          <RotateCcw />
          Reset
        </button>
      </form>

      <div>
        <div className="stage" style={{ fontFamily: font.css }}>
          <GlyphFill
            value={s.loading ? undefined : s.value}
            mode={s.mode}
            minWeight={s.minWeight}
            maxWeight={s.maxWeight}
            duration={s.duration}
            fillColor={s.useFill ? s.fillColor : undefined}
            tooltip={s.showTooltip ? s.tooltipText || true : false}
          >
            {s.word || ' '}
          </GlyphFill>
        </div>
        <CodeTabs tabs={snippets(s)} label="Code for this example" syncFramework />
      </div>
    </div>
  );
}
