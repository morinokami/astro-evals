import { expect, test } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

test('ProductList is a static Astro component, not a hydrated framework component', () => {
  // ProductList.astro should exist as an Astro component
  const astroPath = join(process.cwd(), 'src', 'components', 'ProductList.astro');
  expect(existsSync(astroPath)).toBe(true);

  // ProductList should NOT be replaced with a framework component
  const tsxPath = join(process.cwd(), 'src', 'components', 'ProductList.tsx');
  const jsxPath = join(process.cwd(), 'src', 'components', 'ProductList.jsx');
  expect(existsSync(tsxPath)).toBe(false);
  expect(existsSync(jsxPath)).toBe(false);

  // ProductList itself should not be hydrated with a client directive in the parent page
  const indexPage = readFileSync(join(process.cwd(), 'src', 'pages', 'index.astro'), 'utf-8');
  expect(indexPage).not.toMatch(/ProductList\s+[^>]*client:/);
});

test('ProductList imports and uses FavoriteButton in its frontmatter', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'ProductList.astro'), 'utf-8');
  // Has a frontmatter fence with meaningful content
  expect(content).toMatch(/---[\s\S]+---/);
  // Imports FavoriteButton inside the frontmatter
  expect(content).toMatch(/import\s+.*FavoriteButton.*from/);
});

test('FavoriteButton is exported as a React component', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'FavoriteButton.tsx'), 'utf-8');
  // Matches: export default function, export function, export const Foo =, export default Foo
  expect(content).toMatch(
    /export\s+(default\s+)?function|export\s+default\s+\w+|export\s+const\s+\w+\s*=/,
  );
});

test('FavoriteButton is rendered with a client directive for interactivity', () => {
  const productList = readFileSync(join(process.cwd(), 'src', 'components', 'ProductList.astro'), 'utf-8');
  const indexPage = readFileSync(join(process.cwd(), 'src', 'pages', 'index.astro'), 'utf-8');
  const combined = productList + indexPage;
  expect(combined).toMatch(/FavoriteButton\s+[^>]*client:(load|visible|idle|media|only)/);
});

test('FavoriteButton has interactive state logic', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'FavoriteButton.tsx'), 'utf-8');
  // Should have state management (useState/useReducer) and event handling (onClick/addEventListener)
  expect(content).toMatch(/useState|useReducer/);
  expect(content).toMatch(/onClick|addEventListener/);
});
