import { RespondFn, SlackShortcut } from '@slack/bolt';
import { initPlainSdk, PlainSdk } from '../plain/plainSdk';
import { getPlainApiKey } from '../db/plainApiKey';

export async function getPlainSdkForSlack(
  slackAction: Pick<SlackShortcut, 'team' | 'enterprise'>,
  respond: RespondFn
): Promise<PlainSdk | null> {
  const apiKeyDetails = await getPlainApiKey({
    teamId: slackAction.team?.id,
    enterpriseId: slackAction.enterprise?.id,
  });
  if (!apiKeyDetails) {
    await respond({
      response_type: 'ephemeral',
      text: `Plain API Key not configured. Please run \`/plain configure <plain api key>\` before trying to use Plain shortcuts.`,
    });
    return null;
  }
  return initPlainSdk(apiKeyDetails);
}
