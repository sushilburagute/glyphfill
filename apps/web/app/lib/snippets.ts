import type { CodeTab } from '../components/CodeTabs';
import { SITE_URL } from './site';

export const FRAMEWORK_TABS: CodeTab[] = [
  {
    id: 'react',
    label: 'React',
    note: 'Renders on the server and works in React Server Components. It forwards its ref, so asChild, styled() and motion() wrappers work.',
    blocks: [
      {
        code: `import { GlyphFill } from 'glyphfill/react';
import 'glyphfill/styles.css';

export function Usage({ used }: { used: number }) {
  return <GlyphFill value={used}>USAGE</GlyphFill>;
}`,
      },
    ],
  },
  {
    id: 'vue',
    label: 'Vue',
    note: "Vue 3.3 or newer. For Nuxt, add 'glyphfill/styles.css' to the css array in nuxt.config instead of importing it in a component.",
    blocks: [
      {
        code: `<script setup lang="ts">
import { GlyphFill } from 'glyphfill/vue';
import 'glyphfill/styles.css';

defineProps<{ used: number }>();
</script>

<template>
  <GlyphFill :value="used">USAGE</GlyphFill>
</template>`,
      },
    ],
  },
  {
    id: 'svelte',
    label: 'Svelte',
    note: 'Svelte 5. The component renders on the server. The action enhances an element you already have, after it mounts.',
    blocks: [
      {
        code: `<script lang="ts">
  import { GlyphFill, glyphfill } from 'glyphfill/svelte';
  import 'glyphfill/styles.css';

  let { used }: { used: number } = $props();
</script>

<GlyphFill value={used} text="USAGE" />

<!-- or as an action -->
<span use:glyphfill={{ value: used }}>USAGE</span>`,
      },
    ],
  },
  {
    id: 'js',
    label: 'JavaScript',
    note: 'Point it at any element. It reads the element’s text and takes it over. Use this for Angular, Solid, Lit, Astro or plain HTML.',
    blocks: [
      {
        caption: 'Any page',
        code: `import { glyphfill } from 'glyphfill';
import 'glyphfill/styles.css';

const el = document.getElementById('usage');
const word = glyphfill(el, { value: 40 });

// letters animate to the new value
word.update({ value: 75 });

// puts the original text back
word.destroy();`,
      },
      {
        caption: 'Angular directive',
        code: `import { Directive, ElementRef, inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { glyphfill, type GlyphFillInstance } from 'glyphfill';

// Add "node_modules/glyphfill/styles.css" to "styles" in angular.json.
// Usage: <span [glyphfill]="used">USAGE</span>
@Directive({ selector: '[glyphfill]', standalone: true })
export class GlyphfillDirective implements OnChanges, OnDestroy {
  @Input('glyphfill') value?: number | null;
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private word?: GlyphFillInstance;

  ngOnChanges() {
    if (this.word) this.word.update({ value: this.value });
    else this.word = glyphfill(this.el.nativeElement, { value: this.value });
  }

  ngOnDestroy() {
    this.word?.destroy();
  }
}`,
      },
    ],
  },
];

export const STACK_TABS: CodeTab[] = [
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    note: 'Import the stylesheet into Tailwind’s components layer, so utilities override it: text-*, data-[gf-state=complete]:*, or arbitrary properties for the CSS variables. On Tailwind v3, a plain import is enough.',
    blocks: [
      {
        caption: 'app.css',
        code: `@import "tailwindcss";
@import "glyphfill/styles.css" layer(components);`,
      },
      {
        caption: 'Usage.tsx',
        code: `<GlyphFill
  value={used}
  className="text-5xl text-zinc-500 [--gf-fill:var(--color-emerald-600)] data-[gf-state=complete]:text-emerald-600"
>
  USAGE
</GlyphFill>`,
      },
    ],
  },
  {
    id: 'shadcn',
    label: 'shadcn/ui',
    note: 'Style it with cn() like any shadcn component. It forwards its ref, so it can be a Radix asChild trigger. Here shadcn’s Tooltip replaces the built-in one.',
    blocks: [
      {
        code: `import { GlyphFill } from 'glyphfill/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function UsageWord({ used, className }: { used: number; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <GlyphFill
          value={used}
          tooltip={false}
          tabIndex={0}
          className={cn('font-semibold text-muted-foreground data-[gf-state=complete]:text-primary', className)}
        >
          Usage
        </GlyphFill>
      </TooltipTrigger>
      <TooltipContent>{used}% of your plan</TooltipContent>
    </Tooltip>
  );
}`,
      },
    ],
  },
  {
    id: 'chakra',
    label: 'Chakra UI',
    note: 'Wrap it with chakra() to use style props. Chakra’s color tokens are CSS variables, so they work for fillColor too.',
    blocks: [
      {
        code: `import { chakra } from '@chakra-ui/react';
import { GlyphFill } from 'glyphfill/react';

const ChakraGlyphFill = chakra(GlyphFill);

export function Usage({ used }: { used: number }) {
  return (
    <ChakraGlyphFill value={used} fontSize="5xl" color="fg.muted" fillColor="var(--chakra-colors-teal-500)">
      USAGE
    </ChakraGlyphFill>
  );
}`,
      },
    ],
  },
  {
    id: 'mui',
    label: 'MUI',
    note: 'Use MUI’s styled() to pull colors from your theme. Inside Typography, the word takes that variant’s size and color.',
    blocks: [
      {
        code: `import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { GlyphFill } from 'glyphfill/react';

const Word = styled(GlyphFill)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '--gf-fill': theme.palette.primary.main,
  '--gf-tip-bg': theme.palette.grey[900],
}));

export function Usage({ used }: { used: number }) {
  return (
    <Typography variant="h2">
      <Word value={used}>USAGE</Word>
    </Typography>
  );
}`,
      },
    ],
  },
  {
    id: 'styled',
    label: 'styled-components',
    note: 'styled() from styled-components or Emotion passes a className, and glyphfill’s own rules have zero specificity, so yours win.',
    blocks: [
      {
        code: `import styled from 'styled-components';
import { GlyphFill } from 'glyphfill/react';

const Word = styled(GlyphFill)\`
  font-size: 3rem;
  color: #64748b;
  --gf-fill: #16a34a;

  &[data-gf-state='complete'] {
    color: #16a34a;
  }
\`;`,
      },
    ],
  },
];

export function aiPrompt(install: string) {
  return `Add glyphfill to this project. It shows progress inside a word: letters get heavier, or fill with ink, as a task completes.

1. Install it: ${install}
2. Read ${SITE_URL}/llms-full.txt for the full API before writing code.
3. Import 'glyphfill/styles.css' once, in the global stylesheet or root layout. If the project uses Tailwind CSS v4, add @import "glyphfill/styles.css" layer(components); to the main CSS file instead.
4. Use the entry point for this project's framework: GlyphFill from 'glyphfill/react', 'glyphfill/vue' or 'glyphfill/svelte', or glyphfill(element, options) from 'glyphfill' anywhere else.
5. Find places where we show a percentage next to a label (usage, quotas, uploads, onboarding steps) and suggest where a GlyphFill word would fit. Ask me before replacing an existing progress bar.`;
}
