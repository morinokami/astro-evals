import { expect, test } from 'vitest';
import { readFileSync, existsSync, globSync } from 'node:fs';
import { join } from 'node:path';

test('Tailwind CSS v4 dependencies are installed', () => {
  const pkgPath = join(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  // Both tailwindcss and the Vite plugin are required for Tailwind v4
  expect(allDeps).toHaveProperty('tailwindcss');
  expect(allDeps).toHaveProperty('@tailwindcss/vite');
});

test('@tailwindcss/vite is configured as a Vite plugin in astro config', () => {
  const configPaths = ['astro.config.mjs', 'astro.config.ts', 'astro.config.js'].map(
    (f) => join(process.cwd(), f),
  );
  const configPath = configPaths.find((p) => existsSync(p));
  expect(configPath).toBeDefined();

  const content = readFileSync(configPath!, 'utf-8');
  // Should import @tailwindcss/vite and register it in vite plugins
  expect(content).toMatch(/@tailwindcss\/vite/);
  expect(content).toMatch(/plugins/);
});

test('A CSS file imports Tailwind', () => {
  const cssFiles = globSync('src/**/*.css', { cwd: process.cwd() });
  expect(cssFiles.length).toBeGreaterThan(0);

  const hasTailwindImport = cssFiles.some((file) => {
    const content = readFileSync(join(process.cwd(), file), 'utf-8');
    return content.match(/@import\s+['"]tailwindcss['"]/);
  });
  expect(hasTailwindImport).toBe(true);
});

test('Layout or page imports the Tailwind CSS file', () => {
  const layoutPath = join(process.cwd(), 'src', 'layouts', 'Layout.astro');
  const pagePath = join(process.cwd(), 'src', 'pages', 'index.astro');

  const layoutContent = existsSync(layoutPath) ? readFileSync(layoutPath, 'utf-8') : '';
  const pageContent = existsSync(pagePath) ? readFileSync(pagePath, 'utf-8') : '';

  const combined = layoutContent + pageContent;
  expect(combined).toMatch(/import\s+['"].*\.css['"]/);
});

test('Index page uses Tailwind utility classes for all required styling categories', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'index.astro');
  const content = readFileSync(pagePath, 'utf-8');

  // PROMPT requires: background color, text color, padding, and font styling
  expect(content).toMatch(/\bbg-/);   // background color
  expect(content).toMatch(/\btext-/); // text color or size
  expect(content).toMatch(/\b(p-|px-|py-|pt-|pb-|pl-|pr-|ps-|pe-)/); // padding
  expect(content).toMatch(/\bfont-/); // font styling
});

test('Does NOT use the legacy @astrojs/tailwind integration', () => {
  const configPaths = ['astro.config.mjs', 'astro.config.ts', 'astro.config.js'].map(
    (f) => join(process.cwd(), f),
  );
  const configPath = configPaths.find((p) => existsSync(p));
  if (configPath) {
    const content = readFileSync(configPath, 'utf-8');
    expect(content).not.toMatch(/@astrojs\/tailwind/);
  }

  const pkgPath = join(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  expect(allDeps).not.toHaveProperty('@astrojs/tailwind');
});
