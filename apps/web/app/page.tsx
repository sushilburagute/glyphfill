import { GlyphFill } from 'glyphfill/react';
import { AiPrompt } from './components/AiPrompt';
import { CodeTabs } from './components/CodeTabs';
import { HeroWord } from './components/Hero';
import { InstallCommand } from './components/InstallCommand';
import { ModeCompare } from './components/ModeCompare';
import { Playground } from './components/Playground';
import { AUTHOR, DESCRIPTION, GITHUB_URL, NPM_URL, SITE_URL } from './lib/site';
import { FRAMEWORK_TABS, STACK_TABS } from './lib/snippets';

const OPTIONS = [
  ['value', 'number', 'none', 'Percent complete, from 0 to 100. Leave it out to show a loading animation.'],
  ['mode', "'sweep' | 'fill' | 'weight'", "'sweep'", 'How the progress is drawn.'],
  ['minWeight', 'number', '100', 'Weight of the unfilled letters.'],
  ['maxWeight', 'number', '900', 'Weight of the filled letters.'],
  ['fillColor', 'string', 'none', 'Any CSS color. Filled letters change to it.'],
  ['duration', 'number', '300', 'Transition length in ms. Turned off when the reader prefers reduced motion.'],
  [
    'tooltip',
    'boolean | string | (word, pct) => string',
    'true',
    'Text shown on hover and focus. Pass false to hide it. pct is null while loading.',
  ],
  ['text', 'string', 'children', 'The word, for Svelte and plain JavaScript. React and Vue read it from children.'],
] as const;

const HOOKS = [
  ['--gf-fill', 'CSS variable', 'Fill color. Same as the fillColor option.'],
  ['--gf-tip-bg', 'CSS variable', 'Tooltip background.'],
  ['--gf-tip-fg', 'CSS variable', 'Tooltip text color.'],
  ['--gf-stroke', 'CSS variable', 'Outline width in fill mode.'],
  ['data-gf-state', 'attribute', 'loading, progress or complete. Style the finished state with it.'],
  ['data-gf-mode', 'attribute', 'sweep, fill or weight.'],
] as const;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'glyphfill',
  description: DESCRIPTION,
  url: SITE_URL,
  codeRepository: GITHUB_URL,
  programmingLanguage: ['TypeScript', 'JavaScript'],
  runtimePlatform: 'Web browser',
  license: 'https://opensource.org/licenses/MIT',
  keywords: 'progress, typography, variable fonts, React, Vue, Svelte, Tailwind CSS',
  author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD with < escaped
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <header className="site-header wrap">
        <a className="logo" href="/">
          glyphfill
        </a>
        <nav className="site-nav" aria-label="Main">
          <a href="#playground">Playground</a>
          <a href="#usage">Docs</a>
          <a href={GITHUB_URL}>GitHub</a>
          <a href={NPM_URL}>npm</a>
        </nav>
      </header>

      <main>
        <section className="hero wrap" aria-labelledby="hero-title">
          <HeroWord />
          <div className="hero-copy">
            <div>
              <h1 id="hero-title">Show progress inside a word.</h1>
              <p>
                glyphfill makes letters heavier, or fills them with ink, as a task gets done. Use it in React, Vue,
                Svelte or plain JavaScript.
              </p>
            </div>
            <InstallCommand />
          </div>
        </section>

        <section className="section wrap" aria-labelledby="inline-title">
          <h2 id="inline-title">Fits in a sentence</h2>
          <p className="sentence">
            Your <GlyphFill value={72}>storage</GlyphFill> is filling up, this month&rsquo;s{' '}
            <GlyphFill value={35} mode="fill">
              budget
            </GlyphFill>{' '}
            is on track, and your <GlyphFill>report</GlyphFill> is still loading.
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

        <section className="section wrap" id="stack" aria-labelledby="stack-title">
          <h2 id="stack-title">Works with your stack</h2>
          <p className="lede">
            glyphfill only styles its own classes, with zero specificity, so your utility classes, themes and styled()
            wrappers win. The word takes your font, size and color.
          </p>
          <CodeTabs tabs={STACK_TABS} label="UI libraries" />
        </section>

        <section className="section wrap" id="usage" aria-labelledby="usage-title">
          <h2 id="usage-title">Usage</h2>
          <div className="docs">
            <div>
              <h3>Install</h3>
              <InstallCommand />
              <h3>Use it</h3>
              <CodeTabs tabs={FRAMEWORK_TABS} label="Frameworks" syncFramework />
            </div>
            <div>
              <h3>Fonts</h3>
              <p>
                Sweep and weight modes need a variable font to move smoothly. With a static font, the browser snaps each
                letter to the nearest weight the font has. Fill mode works with any font.
              </p>
              <h3>Styling</h3>
              <p>
                The word inherits your font, size and color. Override anything with your own classes, or use the CSS
                variables and attributes below.
              </p>
              <h3>Accessibility</h3>
              <p>
                Each word is a progress bar with a value, so screen readers announce it as &ldquo;storage, 72%
                completed&rdquo;, or as loading. When the tooltip is on, the word can be reached with Tab. Animations
                turn off when the reader prefers reduced motion.
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
              <h3>CSS variables and attributes</h3>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Kind</th>
                      <th scope="col">What it does</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HOOKS.map(([name, kind, what]) => (
                      <tr key={name}>
                        <td>
                          <code>{name}</code>
                        </td>
                        <td>{kind}</td>
                        <td>{what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section wrap" id="ai" aria-labelledby="ai-title">
          <h2 id="ai-title">Add it with an AI assistant</h2>
          <p className="lede">
            Paste this into Claude Code, Cursor, Copilot or any coding assistant. It points the assistant at{' '}
            <a href="/llms-full.txt">llms-full.txt</a>, the full docs as plain text. There is also a shorter{' '}
            <a href="/llms.txt">llms.txt</a>.
          </p>
          <AiPrompt />
        </section>
      </main>

      <footer className="site-footer wrap">
        <p>
          Made by <a href={AUTHOR.url}>{AUTHOR.name}</a>. MIT licensed.
        </p>
        <nav className="footer-nav" aria-label="Project">
          <a href={GITHUB_URL}>GitHub</a>
          <a href={NPM_URL}>npm</a>
          <a href="/llms.txt">llms.txt</a>
          <a href={AUTHOR.url}>sush.dev</a>
        </nav>
      </footer>
    </>
  );
}
