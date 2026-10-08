import type { NextConfig } from 'next';

const config: NextConfig = {
  // Build to plain files in `out/` so hosting never runs a server function.
  output: 'export',
  reactStrictMode: true,
};

export default config;
