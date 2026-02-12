Set up Content Collections for the blog posts in `src/content/blog/` using the Astro Content Layer API. Create the collection config at `src/content.config.ts` with the `glob` loader from `astro/loaders` and define a Zod schema (from `astro/zod`) that validates the `title` (string) and `pubDate` (date) frontmatter fields. Export the collection via the `collections` object.

Then implement the blog listing page at `src/pages/blog/index.astro`. Use `getCollection()` to query all blog posts, sort them by `pubDate` (newest first), and display each post's title and publication date. Access entry data through the `.data` property (e.g. `post.data.title`).

**Note:** Before starting, if the Astro Docs MCP server is available, use it to look up the official docs and confirm the correct and up-to-date installation steps and API usage.
