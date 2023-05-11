import { WebClient } from '@slack/web-api';

export async function resolveSlackMentions(
  webClient: WebClient,
  text: string | undefined
): Promise<string | undefined> {
  if (!text) {
    return undefined;
  }
  const slackMentionRegex = /<@([A-Z0-9]+)>/g;
  const slackMentions = text.match(slackMentionRegex);
  if (slackMentions) {
    for (const slackMention of slackMentions) {
      const userId = slackMention.replace(/[<@>]/g, '');
      const userInfo = await webClient.users.info({ user: userId });
      const userName =
        userInfo.user?.profile?.display_name ||
        userInfo.user?.profile?.real_name_normalized ||
        userInfo.user?.profile?.real_name ||
        userInfo.user?.name;
      text = text.replace(slackMention, `@${userName}` ?? '');
    }
    return text;
  }
  return text;
}
