'use client';

import { useId } from 'react';
import { CopyButton } from './CopyButton';
import { installCommand, PACKAGE_MANAGERS, usePackageManager } from './choice';

export function InstallCommand() {
  const [pm, setPm] = usePackageManager();
  const id = useId();
  const command = installCommand(pm);

  return (
    <div className="install">
      <fieldset className="pm">
        <legend className="visually-hidden">Package manager</legend>
        {PACKAGE_MANAGERS.map((name) => (
          <label key={name}>
            <input type="radio" name={`${id}-pm`} value={name} checked={pm === name} onChange={() => setPm(name)} />
            {name}
          </label>
        ))}
      </fieldset>
      <div className="install-row">
        <code>{command}</code>
        <CopyButton text={command} />
      </div>
    </div>
  );
}
