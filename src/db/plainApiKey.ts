import { db } from './db';
import { slackInstallations } from './schema/schema';
import { eq } from 'drizzle-orm';

export interface SlackIdentifier {
  teamId?: string;
  enterpriseId?: string;
}

function throwError(msg: string): never {
  throw new Error(msg);
}
function getSlackId(identifier: SlackIdentifier) {
  return identifier.enterpriseId ?? identifier.teamId ?? throwError('No slack id found');
}

export async function savePlainApiKeyDetails(
  identifier: SlackIdentifier,
  args: {
    plainApiKey: string;
    plainWorkspaceId: string;
  }
): Promise<void> {
  await db
    .update(slackInstallations)
    .set({ plainApiKey: args.plainApiKey, plainWorkspaceId: args.plainWorkspaceId })
    .where(eq(slackInstallations.id, getSlackId(identifier)));
}

export async function getPlainApiKey(
  identifier: SlackIdentifier
): Promise<{ plainApiKey: string; plainWorkspaceId: string } | null> {
  const result = await db
    .select()
    .from(slackInstallations)
    .where(eq(slackInstallations.id, getSlackId(identifier)));
  if (result.length === 0) {
    throw new Error(`No slack installation found for ${JSON.stringify(identifier)}`);
  }
  const first = result[0];
  if (first.plainApiKey && first.plainWorkspaceId) {
    return {
      plainApiKey: first.plainApiKey,
      plainWorkspaceId: first.plainWorkspaceId,
    };
  }
  return null;
}
