Implement a contact form on the contact page (`src/pages/contact.astro`) using Astro Actions. Define the action in `src/actions/index.ts` — import `defineAction` from `astro:actions` and `z` from `astro/zod`, and export a `server` object containing the action.

The action should:
- Accept form data (`accept: 'form'`)
- Validate `name` (required string) and `message` (required string) inputs using a Zod schema (`z.object`)
- Include a `handler` function that processes the submission

Wire the contact page form to the action. You can either use the HTML form action approach (`<form method="POST" action={actions.xxx}>`) or a client-side script that calls the action. Make sure to import `actions` from `astro:actions` in the contact page.

**Note:** Before starting, if the Astro Docs MCP server is available, use it to look up the official docs and confirm the correct and up-to-date installation steps and API usage.
