import { App, MessageShortcut } from '@slack/bolt';
import { UsersInfoResponse, WebClient } from '@slack/web-api';
import { upsertCustomer } from '../plain/upsertCustomer';
import { upsertCustomTimelineEntry } from '../plain/upsertCustomTimelineEntry';
import { getPlainSdkForSlack } from './getPlainSdkForSlack';
import { buildCustomTimelineEntry } from './buildCustomTimelineEntry';
import { resolveSlackMentions } from './resolveSlackMentions';

interface User {
  fullName: string;
  email: string;
}

function handleUserResult(response: UsersInfoResponse): User {
  if (
    response.user?.profile?.real_name_normalized !== undefined &&
    response.user?.profile?.email !== undefined
  ) {
    return {
      fullName: response.user.profile.real_name_normalized,
      email: response.user.profile.email,
    };
  }
  throw new Error(`Could not get user info for: ${JSON.stringify(response)}`);
}

function buildSlackMessageId(shortcut: MessageShortcut): string {
  return `${shortcut.team?.id}_${shortcut.channel.id}_${shortcut.message.ts}`;
}

async function buildChannelName(shortcut: MessageShortcut, client: WebClient): Promise<string> {
  if (shortcut.channel.id.startsWith('D')) {
    const userDoingAction = await client.users
      .info({ user: shortcut.user.id })
      .then(handleUserResult);
    return `a direct message with ${userDoingAction.fullName}`;
  } else {
    return `#${shortcut.channel.name}`;
  }
}

export function shortcut(app: App): void {
  app.shortcut(/^(add|log)_to_plain$/, async ({ shortcut, ack, respond, client, logger }) => {
    try {
      // Acknowledge shortcut request
      await ack();

      const sdk = await getPlainSdkForSlack(shortcut, respond);
      if (!sdk) {
        return;
      }

      if (shortcut.type === 'shortcut') {
        logger.error('Global shortcut action not supported');
        return;
      }

      const message = shortcut.message;
      if (message.user === undefined) {
        logger.error(`User is undefined: ${JSON.stringify(shortcut.message, null, 2)} `);
        return;
      }

      logger.info(`Handling shortcut: ${JSON.stringify(shortcut, null, 2)}`);

      const [customerInSlack, allWorkspaceUsers, messagePermaLink] = await Promise.all([
        client.users.info({ user: message.user }).then(handleUserResult),
        sdk.getAllWorkspaceUsers(),
        client.chat.getPermalink({
          channel: shortcut.channel.id,
          message_ts: message.ts,
        }),
      ]);

      if (
        allWorkspaceUsers.data.users.edges.some(
          (workspaceUser) => workspaceUser.node.email === customerInSlack.email
        )
      ) {
        return await respond({
          response_type: 'ephemeral',
          text: `❌ Can't ${
            shortcut.callback_id === 'add_to_plain' ? 'add' : 'log'
          } this message to Plain as this message was sent by a Plain user (${
            customerInSlack.fullName
          } ${
            customerInSlack.email
          }) and not a customer.\nTry the action again with a message from a customer.`,
        });
      }

      const customer = await upsertCustomer(sdk, customerInSlack);
      const messageId = buildSlackMessageId(shortcut);
      const [channelName, messageText] = await Promise.all([
        buildChannelName(shortcut, client),
        resolveSlackMentions(client, message.text),
      ]);
      await upsertCustomTimelineEntry(sdk, {
        customerId: customer.id,
        externalId: messageId,
        title: `Slack message in ${channelName}`,
        changeCustomerStatusToActive: shortcut.callback_id === 'add_to_plain',
        components: buildCustomTimelineEntry({
          text: messageText,
          messagePermalink: messagePermaLink.permalink,
          teamId: shortcut.team?.id,
          channelId: shortcut.channel.id,
        }),
      });
      await respond({
        response_type: 'ephemeral',
        text: `✅ Slack message ${
          shortcut.callback_id === 'add_to_plain' ? 'added' : 'logged'
        } to Plain! 🔗 <https://app.plain.com/workspace/${sdk.workspaceId}/customer/${
          customer.id
        }|*${customer.fullName}* _(${customer.email.email})_>`,
      });
    } catch (error) {
      logger.error(error);
    }
  });
}
