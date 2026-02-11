import { expect, test } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

test('ProductList is a static Astro component without client directives', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'ProductList.astro'), 'utf-8');
  expect(content).not.toMatch(/client:/);
});

test('ProductList uses the component script fence for data or props', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'ProductList.astro'), 'utf-8');
  expect(content).toMatch(/---[\s\S]+---/);
});

test('FavoriteButton is exported as a React component', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'FavoriteButton.tsx'), 'utf-8');
  expect(content).toMatch(/export\s+(default\s+)?function/);
});

test('FavoriteButton is rendered with a client directive for interactivity', () => {
  const productList = readFileSync(join(process.cwd(), 'src', 'components', 'ProductList.astro'), 'utf-8');
  const indexPage = readFileSync(join(process.cwd(), 'src', 'pages', 'index.astro'), 'utf-8');
  const combined = productList + indexPage;
  expect(combined).toMatch(/FavoriteButton\s+[^>]*client:(load|visible|idle|only)/);
});

test('FavoriteButton has interactive state logic', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'FavoriteButton.tsx'), 'utf-8');
  expect(content).toMatch(/useState|useReducer|onClick|addEventListener/);
});
