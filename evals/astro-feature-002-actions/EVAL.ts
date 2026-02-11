import { expect, test } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

test('Action is defined using defineAction', () => {
  const actionPath = join(process.cwd(), 'src', 'actions', 'index.ts');
  expect(existsSync(actionPath)).toBe(true);
  const content = readFileSync(actionPath, 'utf-8');
  expect(content).toMatch(/defineAction/);
});

test('Action has Zod validation schema for name and message', () => {
  const actionPath = join(process.cwd(), 'src', 'actions', 'index.ts');
  const content = readFileSync(actionPath, 'utf-8');
  expect(content).toMatch(/z\.object/);
  expect(content).toMatch(/name/);
  expect(content).toMatch(/message/);
});

test('Action accepts form data', () => {
  const actionPath = join(process.cwd(), 'src', 'actions', 'index.ts');
  const content = readFileSync(actionPath, 'utf-8');
  expect(content).toMatch(/accept\s*:\s*['"]form['"]/);
});

test('Action has a handler function', () => {
  const actionPath = join(process.cwd(), 'src', 'actions', 'index.ts');
  const content = readFileSync(actionPath, 'utf-8');
  expect(content).toMatch(/handler/);
});

test('Contact page form is wired to the action', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'contact.astro');
  const content = readFileSync(pagePath, 'utf-8');
  expect(content).toMatch(/action\s*=\s*\{/);
});
