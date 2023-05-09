import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.graphql',
  documents: 'src/plain/graphql/*.gql',
  generates: {
    'src/plain/graphql/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        rawRequest: true,
        extensionsType: 'unknown',
      },
    },
  },
};

export default config;
