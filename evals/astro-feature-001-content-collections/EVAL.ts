import { expect, test } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function findContentConfig(): string | null {
  // Astro v5 uses src/content.config.{ts,js,mjs} (NOT src/content/config.ts)
  const candidates = [
    'src/content.config.ts',
    'src/content.config.js',
    'src/content.config.mjs',
  ].map((f) => join(process.cwd(), f));
  return candidates.find((p) => existsSync(p)) ?? null;
}

test('Content collection config exists at src/content.config.ts (v5 Content Layer API)', () => {
  const configPath = findContentConfig();
  // Must exist at the v5 location, not the legacy src/content/config.ts
  expect(configPath).not.toBeNull();
});

test('Collection config uses defineCollection and exports collections', () => {
  const configPath = findContentConfig();
  expect(configPath).not.toBeNull();
  const content = readFileSync(configPath!, 'utf-8');

  expect(content).toMatch(/defineCollection/);
  // Must export a collections object to register collections
  expect(content).toMatch(/export\s+(const\s+)?collections/);
});

test('Collection uses glob loader from astro/loaders', () => {
  const configPath = findContentConfig();
  expect(configPath).not.toBeNull();
  const content = readFileSync(configPath!, 'utf-8');

  // v5 requires importing loaders from 'astro/loaders'
  expect(content).toMatch(/astro\/loaders/);
  expect(content).toMatch(/glob\s*\(/);
});

test('Collection schema validates title and pubDate with Zod', () => {
  const configPath = findContentConfig();
  expect(configPath).not.toBeNull();
  const content = readFileSync(configPath!, 'utf-8');

  // Zod should be imported from 'astro/zod' (v5), not 'astro:content' (legacy)
  expect(content).toMatch(/astro\/zod/);
  expect(content).toMatch(/z\.object/);
  expect(content).toMatch(/title/);
  expect(content).toMatch(/pubDate/);
});

test('Blog listing page uses getCollection to query posts', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'blog', 'index.astro');
  const content = readFileSync(pagePath, 'utf-8');
  expect(content).toMatch(/getCollection/);
});

test('Blog listing page accesses entry data via .data property', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'blog', 'index.astro');
  const content = readFileSync(pagePath, 'utf-8');

  // v5 API: entry fields are accessed via .data (e.g. post.data.title)
  expect(content).toMatch(/\.data\.title/);
  expect(content).toMatch(/\.data\.pubDate/);
});

test('Blog listing page sorts posts by date', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'blog', 'index.astro');
  const content = readFileSync(pagePath, 'utf-8');

  // Collection order is non-deterministic; sorting must be done manually
  expect(content).toMatch(/\.sort\s*\(/);
});
