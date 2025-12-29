import { defineConfig } from 'orval';

export default defineConfig({
  auth: {
    input: {
      target: 'http://localhost:5476/openapi/v1.json',
    },
    output: {
      mode: 'single',
      target: './src/api/auth.gen.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/fetcher.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
