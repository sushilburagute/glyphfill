import { readFile } from 'node:fs/promises';
import path from 'node:path';

// The package README is the single source of truth; this serves it as plain
// text for AI assistants. Read once at build time.
export const dynamic = 'force-static';

export async function GET() {
  const readme = await readFile(path.join(process.cwd(), '../../packages/glyphfill/README.md'), 'utf8');
  return new Response(readme, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
