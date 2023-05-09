import { getSdk } from './graphql';
import { GraphQLClient } from 'graphql-request';

export type PlainSdk = ReturnType<typeof getSdk> & {
  workspaceId: string;
};

export function initPlainSdk(args: { plainApiKey: string; plainWorkspaceId: string }): PlainSdk {
  return {
    ...getSdk(
      new GraphQLClient('https://core-api.uk.plain.com/graphql/v1', {
        headers: {
          Authorization: `Bearer ${args.plainApiKey}`,
          'User-Agent': 'plain-slack-integration',
        },
      })
    ),
    workspaceId: args.plainWorkspaceId,
  };
}
