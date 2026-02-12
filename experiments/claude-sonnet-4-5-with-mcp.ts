import type { ExperimentConfig } from '@vercel/agent-eval';

const config: ExperimentConfig = {
  agent: 'claude-code',
  model: 'claude-sonnet-4-5',
  scripts: ['build'],
  runs: 1,
  earlyExit: true,
  timeout: 1200,
  setup: async (sandbox) => {
    await sandbox.writeFiles({
      '.mcp.json': JSON.stringify({
        mcpServers: {
          'astro-docs': {
            type: 'http',
            url: 'https://mcp.docs.astro.build/mcp',
          },
        },
      }),
    });
  }
};

export default config;
