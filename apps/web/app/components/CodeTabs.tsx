'use client';

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from 'react';
import { CodeBlock } from './CopyButton';
import { type Framework, useFramework } from './choice';

export interface CodeTab {
  id: string;
  label: string;
  note?: ReactNode;
  blocks: { caption?: string; code: string }[];
}

/**
 * Accessible tabs of code samples. With `syncFramework`, the selected tab is
 * the page-wide framework choice, so every framework tab set moves together.
 */
export function CodeTabs({ tabs, label, syncFramework }: { tabs: CodeTab[]; label: string; syncFramework?: boolean }) {
  const [framework, setFramework] = useFramework();
  const [local, setLocal] = useState(tabs[0]?.id ?? '');
  const selected = syncFramework ? framework : local;
  const select = (tabId: string) => (syncFramework ? setFramework(tabId as Framework) : setLocal(tabId));
  const current = tabs.find((t) => t.id === selected) ?? tabs[0];
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : e.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : undefined;
    if (next === undefined) return;
    e.preventDefault();
    const tab = tabs[next];
    if (!tab) return;
    select(tab.id);
    refs.current[next]?.focus();
  };

  if (!current) return null;

  return (
    <div className="code-tabs">
      <div className="tabs" role="tablist" aria-label={label}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-${tab.id}-tab`}
            aria-controls={`${id}-panel`}
            aria-selected={tab.id === current.id}
            tabIndex={tab.id === current.id ? 0 : -1}
            className="tab"
            onClick={() => select(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${current.id}-tab`} className="tab-panel">
        {current.note ? <div className="note">{current.note}</div> : null}
        {current.blocks.map((block) => (
          <div key={block.caption ?? block.code.slice(0, 40)}>
            {block.caption ? <p className="code-caption">{block.caption}</p> : null}
            <CodeBlock code={block.code} />
          </div>
        ))}
      </div>
    </div>
  );
}
