import { expect, test } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function findActionsFile(): string | null {
  const candidates = ['src/actions/index.ts', 'src/actions/index.js'].map(
    (f) => join(process.cwd(), f),
  );
  return candidates.find((p) => existsSync(p)) ?? null;
}

test('Actions file exists and exports a server object with defineAction', () => {
  const actionPath = findActionsFile();
  expect(actionPath).not.toBeNull();

  const content = readFileSync(actionPath!, 'utf-8');
  // Must import defineAction from 'astro:actions'
  expect(content).toMatch(/astro:actions/);
  expect(content).toMatch(/defineAction/);
  // Must export a server object to register actions
  expect(content).toMatch(/export\s+(const\s+)?server/);
});

test('Action uses Zod from astro/zod to validate name and message inputs', () => {
  const actionPath = findActionsFile();
  expect(actionPath).not.toBeNull();

  const content = readFileSync(actionPath!, 'utf-8');
  // Zod must be imported from 'astro/zod'
  expect(content).toMatch(/astro\/zod/);
  expect(content).toMatch(/z\.object/);
  expect(content).toMatch(/name/);
  expect(content).toMatch(/message/);
});

test('Action accepts form data', () => {
  const actionPath = findActionsFile();
  expect(actionPath).not.toBeNull();

  const content = readFileSync(actionPath!, 'utf-8');
  expect(content).toMatch(/accept\s*:\s*['"]form['"]/);
});

test('Action defines a handler function', () => {
  const actionPath = findActionsFile();
  expect(actionPath).not.toBeNull();

  const content = readFileSync(actionPath!, 'utf-8');
  // Match handler as a property (handler:) or method shorthand (handler()/ async handler())
  expect(content).toMatch(/handler\s*[:(]/);
});

test('Contact page imports and references Astro actions', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'contact.astro');
  const content = readFileSync(pagePath, 'utf-8');

  // Must import actions from 'astro:actions' (either in frontmatter or <script>)
  expect(content).toMatch(/astro:actions/);
  // Must reference a specific action (e.g. actions.contact, actions.submitContact)
  expect(content).toMatch(/actions\.\w+/);
});

test('Contact form is submitted via POST method or client-side action call', () => {
  const pagePath = join(process.cwd(), 'src', 'pages', 'contact.astro');
  const content = readFileSync(pagePath, 'utf-8');

  // HTML form action approach: <form method="POST" action={actions.xxx}>
  const hasPostMethod = /method\s*=\s*["']POST["']/i.test(content);
  // Client-side approach: await actions.xxx(...) in a <script> block
  const hasClientActionCall = /await\s+actions\.\w+/.test(content);
  expect(hasPostMethod || hasClientActionCall).toBe(true);
});
