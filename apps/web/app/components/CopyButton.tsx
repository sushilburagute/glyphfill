'use client';

import { useEffect, useState } from 'react';

export function CopyButton({ text, className = 'button' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          // Clipboard can be blocked (insecure context, permissions); the text stays selectable.
        }
      }}
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="code">
      <pre>
        <code>{code}</code>
      </pre>
      <div className="copy">
        <CopyButton text={code} />
      </div>
    </div>
  );
}
