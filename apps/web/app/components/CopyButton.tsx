'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CopyButton({
  text,
  label = 'Copy',
  className = 'button',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
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
      data-copied={copied || undefined}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          // Clipboard can be blocked (insecure context, permissions); the text stays selectable.
        }
      }}
    >
      {copied ? <Check /> : <Copy />}
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
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
