import { expect, test } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

test('UserProfile fetches data in the component script fence', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'UserProfile.astro'), 'utf-8');
  const fenceMatch = content.match(/---[\s\S]+?---/);
  expect(fenceMatch).not.toBeNull();
  const fenceContent = fenceMatch![0];
  expect(fenceContent).toMatch(/fetch\s*\(/);
  expect(fenceContent).toMatch(/await/);
});

test('UserProfile does not use useEffect', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'UserProfile.astro'), 'utf-8');
  expect(content).not.toMatch(/useEffect/);
});

test('UserProfile does not use useState', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'UserProfile.astro'), 'utf-8');
  expect(content).not.toMatch(/useState/);
});

test('UserProfile displays user name and email', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'UserProfile.astro'), 'utf-8');
  expect(content).toMatch(/name/);
  expect(content).toMatch(/email/);
});

test('UserProfile does not use client directives or script tags', () => {
  const content = readFileSync(join(process.cwd(), 'src', 'components', 'UserProfile.astro'), 'utf-8');
  expect(content).not.toMatch(/client:/);
  expect(content).not.toMatch(/<script/);
});
