import { expect, test } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

test('Content collection config exists and uses defineCollection', () => {
  const configPath = join(process.cwd(), 'src', 'content.config.ts');
  const altConfigPath = join(process.cwd(), 'src', 'content', 'config.ts');

  const exists = existsSync(configPath) || existsSync(altConfigPath);
  expect(exists).toBe(true);

  const content = existsSync(configPath)
    ? readFileSync(configPath, 'utf-8')
    : readFileSync(altConfigPath, 'utf-8');
  expect(content).toMatch(/defineCollection/);
});

test('Collection schema validates title and pubDate with Zod', () => {
  const configPath = join(process.cwd(), 'src', 'content.config.ts');
  const altConfigPath = join(process.cwd(), 'src', 'content', 'config.ts');

  const content = existsSync(configPath)
    ? readFileSync(configPath, 'utf-8')
    : readFileSync(altConfigPath, 'utf-8');
  expect(content).toMatch(/z\.object/);
  expect(content).toMatch(/title/);
  expect(content).toMatch(/pubDate/);
});

test('Blog listing page uses getCollection to query posts', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'blog', 'index.astro');
  const content = readFileSync(pagePath, 'utf-8');
  expect(content).toMatch(/getCollection/);
});

test('Blog listing page displays post titles', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'blog', 'index.astro');
  const content = readFileSync(pagePath, 'utf-8');
  expect(content).toMatch(/\.data\.title|\.title/);
});

test('Collection uses glob loader', () => {
  const configPath = join(process.cwd(), 'src', 'content.config.ts');
  const altConfigPath = join(process.cwd(), 'src', 'content', 'config.ts');

  const content = existsSync(configPath)
    ? readFileSync(configPath, 'utf-8')
    : readFileSync(altConfigPath, 'utf-8');
  expect(content).toMatch(/glob\s*\(/);
});
