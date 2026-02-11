import { expect, test } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { globSync } from 'glob';

test('Tailwind CSS is installed as a dependency', () => {
  const pkgPath = join(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  expect(allDeps).toHaveProperty('tailwindcss');
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

test('Layout or page imports the CSS file', () => {
  const layoutPath = join(process.cwd(), 'src', 'layouts', 'Layout.astro');
  const pagePath = join(process.cwd(), 'src', 'pages', 'index.astro');

  const layoutContent = existsSync(layoutPath) ? readFileSync(layoutPath, 'utf-8') : '';
  const pageContent = existsSync(pagePath) ? readFileSync(pagePath, 'utf-8') : '';

  const combined = layoutContent + pageContent;
  expect(combined).toMatch(/import\s+['"].*\.css['"]/);
});

test('Index page uses Tailwind utility classes', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'index.astro');
  const content = readFileSync(pagePath, 'utf-8');

  const hasTailwindClasses = content.match(/class\s*=\s*["'][^"']*\b(bg-|text-|p-|px-|py-|m-|mx-|my-|flex|grid|font-|rounded|shadow|w-|h-)/);
  expect(hasTailwindClasses).not.toBeNull();
});

test('Does NOT use the legacy @astrojs/tailwind integration', () => {
  const configPath = join(process.cwd(), 'astro.config.mjs');
  if (existsSync(configPath)) {
    const content = readFileSync(configPath, 'utf-8');
    expect(content).not.toMatch(/@astrojs\/tailwind/);
  }

  const pkgPath = join(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  expect(allDeps).not.toHaveProperty('@astrojs/tailwind');
});
