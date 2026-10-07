'use client';

import { aiPrompt } from '../lib/snippets';
import { CopyButton } from './CopyButton';
import { installCommand, usePackageManager } from './choice';

export function AiPrompt() {
  const [pm] = usePackageManager();
  const prompt = aiPrompt(installCommand(pm));

  return (
    <div className="prompt">
      <div className="prompt-head">
        <span>Prompt</span>
        <CopyButton text={prompt} label="Copy prompt" />
      </div>
      <pre>
        <code>{prompt}</code>
      </pre>
    </div>
  );
}
