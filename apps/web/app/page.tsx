import { GlyphFill } from 'glyphfill/react';
import { CodeBlock, CopyButton } from './components/CopyButton';
import { HeroWord } from './components/Hero';
import { ModeCompare } from './components/ModeCompare';
import { Playground } from './components/Playground';

const INSTALL = 'npm install glyphfill';

const REACT_EXAMPLE = `import { GlyphFill } from 'glyphfill/react';
import 'glyphfill/styles.css';

export function Usage({ used }: { used: number }) {
  return <GlyphFill value={used}>USAGE</GlyphFill>;
}`;

const VANILLA_EXAMPLE = `import { glyphfill } from 'glyphfill';
import 'glyphfill/styles.css';

const el = document.getElementById('usage');
const word = glyphfill(el, { value: 40 });

// letters animate to the new value
word.update({ value: 75 });

// puts the original text back
word.destroy();`;

const OPTIONS = [
  ['value', 'number', 'required', 'Percent complete, from 0 to 100.'],
  ['mode', "'sweep' | 'fill' | 'weight'", "'sweep'", 'How the progress is drawn.'],
  ['minWeight', 'number', '100', 'Weight of the unfilled letters.'],
  ['maxWeight', 'number', '900', 'Weight of the filled letters.'],
  ['duration', 'number', '300', 'Transition length in ms. Turned off when the reader prefers reduced motion.'],
  [
    'tooltip',
    'boolean | string | (word, pct) => string',
    'true',
    'Text shown on hover and focus. Pass false to hide it.',
  ],
] as const;

export default function Home() {
  return (
    <>
      <header className="site-header wrap">
        <a className="logo" href="/">
          glyphfill
        </a>
        <nav className="site-nav" aria-label="Main">
          <a href="#playground">Playground</a>
          <a href="#usage">Usage</a>
          <a href="https://www.npmjs.com/package/glyphfill">npm</a>
        </nav>
      </header>

      <main>
        <section className="hero wrap" aria-labelledby="hero-title">
          <HeroWord />
          <div className="hero-copy">
            <div>
              <h1 id="hero-title">Show progress inside a word.</h1>
              <p>
                glyphfill makes letters heavier, or fills them with ink, as a task gets done. Use it in React or plain
                JavaScript.
              </p>
            </div>
            <div className="install">
              <code>{INSTALL}</code>
              <CopyButton text={INSTALL} />
            </div>
          </div>
        </section>

        <section className="section wrap" aria-labelledby="inline-title">
          <h2 id="inline-title">Fits in a sentence</h2>
          <p className="sentence">
            Your <GlyphFill value={72}>storage</GlyphFill> is filling up, but this month&rsquo;s{' '}
            <GlyphFill value={35} mode="fill">
              budget
            </GlyphFill>{' '}
            is on track.
          </p>
          <p className="note">Hover over a word, or Tab to it, to see its exact progress.</p>
        </section>

        <section className="section wrap" id="playground" aria-labelledby="playground-title">
          <h2 id="playground-title">Playground</h2>
          <p className="lede">Try a word, a mode and a font. The code below updates as you go.</p>
          <Playground />
        </section>

        <section className="section wrap" aria-labelledby="modes-title">
          <h2 id="modes-title">Three modes</h2>
          <p className="lede">Pick how the progress shows. Drag the slider to compare them side by side.</p>
          <ModeCompare />
        </section>

        <section className="section wrap" id="usage" aria-labelledby="usage-title">
          <h2 id="usage-title">Usage</h2>
          <div className="docs">
            <div>
              <h3>Install</h3>
              <CodeBlock code={INSTALL} />
              <h3>React</h3>
              <p className="note">
                The component has no hooks or effects, so it renders on the server and works in React Server Components.
              </p>
              <CodeBlock code={REACT_EXAMPLE} />
              <h3>JavaScript</h3>
              <p className="note">Point it at any element. It reads the element&rsquo;s text and takes it over.</p>
              <CodeBlock code={VANILLA_EXAMPLE} />
            </div>
            <div>
              <h3>Fonts</h3>
              <p>
                Sweep and weight modes need a variable font to move smoothly. With a static font, the browser snaps each
                letter to the nearest weight the font has. Fill mode works with any font.
              </p>
              <h3>Styling</h3>
              <p>
                The word inherits your font, size and color. Set <code>--gf-tip-bg</code> and <code>--gf-tip-fg</code>{' '}
                to color the tooltip, and <code>--gf-stroke</code> to change the outline width in fill mode.
              </p>
              <h3>Accessibility</h3>
              <p>
                Each word is a progress bar with a value, so screen readers announce it as &ldquo;storage, 72%
                completed&rdquo;. When the tooltip is on, the word can be reached with Tab. Animations turn off when the
                reader prefers reduced motion.
              </p>
            </div>
            <div className="docs-wide">
              <h3>Options</h3>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Option</th>
                      <th scope="col">Type</th>
                      <th scope="col">Default</th>
                      <th scope="col">What it does</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OPTIONS.map(([name, type, def, what]) => (
                      <tr key={name}>
                        <td>
                          <code>{name}</code>
                        </td>
                        <td>
                          <code>{type}</code>
                        </td>
                        <td>
                          <code>{def}</code>
                        </td>
                        <td>{what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer wrap">
        <span>glyphfill is MIT licensed.</span>
        <a href="https://www.npmjs.com/package/glyphfill">glyphfill on npm</a>
      </footer>
    </>
  );
}
