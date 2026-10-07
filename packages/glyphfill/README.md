# glyphfill

Show progress inside a word. As a task completes, letters get heavier or fill with ink. Hover the word to see "USAGE · 40% completed".

- Three modes: `sweep`, `fill`, `weight`
- React component and a plain JavaScript API
- No dependencies. React is an optional peer dependency.
- Renders on the server, works in React Server Components
- Accessible: exposed as a `progressbar` with a readable value, keyboard-reachable tooltip, respects reduced motion

## Install

```sh
npm install glyphfill
```

## React

```tsx
import { GlyphFill } from 'glyphfill/react';
import 'glyphfill/styles.css';

<GlyphFill value={40}>USAGE</GlyphFill>
<GlyphFill value={40} mode="fill">USAGE</GlyphFill>
<GlyphFill value={40} tooltip={(word, pct) => `${word}: ${pct}% used`}>USAGE</GlyphFill>
```

Any other props (`className`, `id`, `onClick`, ...) go to the outer `<span>`.

## JavaScript

```js
import { glyphfill } from 'glyphfill';
import 'glyphfill/styles.css';

const word = glyphfill(document.getElementById('usage'), { value: 40 });

word.update({ value: 75 }); // letters animate to the new value
word.destroy();             // puts the original text back
```

`glyphfill()` reads the element's text. Pass `text` to set it explicitly.

## Options

| Option      | Type                                         | Default   | What it does                                                         |
| ----------- | -------------------------------------------- | --------- | -------------------------------------------------------------------- |
| `value`     | `number`                                     | required  | Percent complete, 0–100. Clamped.                                    |
| `mode`      | `'sweep' \| 'fill' \| 'weight'`              | `'sweep'` | How the progress is drawn.                                           |
| `minWeight` | `number`                                     | `100`     | Weight of the unfilled letters.                                      |
| `maxWeight` | `number`                                     | `900`     | Weight of the filled letters.                                        |
| `duration`  | `number`                                     | `300`     | Transition length in ms. Turned off under `prefers-reduced-motion`.  |
| `tooltip`   | `boolean \| string \| (word, pct) => string` | `true`    | Text shown on hover and focus. `false` hides it.                     |

## Modes

- **`sweep`**: letters before the progress point turn heavy, the rest stay thin, and the letter on the edge sits in between. At 40%, the five letters of `USAGE` get weights `900 900 100 100 100`.
- **`fill`**: solid ink covers outlined letters from left to right, like a progress bar shaped like text. Works with any font.
- **`weight`**: the whole word gets heavier together.

## Fonts

`sweep` and `weight` need a [variable font](https://fonts.google.com/?categoryFilters=Technology:%2FTechnology%2FVariable) to move smoothly. With a static font, the browser snaps each letter to the nearest weight the font has. `fill` works with any font.

The word reserves the width of its heaviest form, so changing the value never shifts the text around it.

## Styling

The word inherits your font, size and color. These CSS custom properties are available:

| Property      | Default                | Used for                    |
| ------------- | ---------------------- | --------------------------- |
| `--gf-tip-bg` | `#18181b`              | Tooltip background          |
| `--gf-tip-fg` | `#fafafa`              | Tooltip text                |
| `--gf-stroke` | `max(1px, 0.025em)`    | Outline width in `fill` mode |

## Helpers

`computeWeights(count, value, min?, max?)`, `computeWeight(value, min?, max?)`, `graphemes(text)` and `createModel(text, options)` are exported from `glyphfill` for building your own renderer.

## License

MIT
