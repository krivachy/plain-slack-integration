import { App } from '@slack/bolt';
import { savePlainApiKeyDetails } from '../db/plainApiKey';
import { initPlainSdk } from '../plain/plainSdk';
import { GetApiKeyDetailsQuery } from '../plain/graphql';
import { difference } from 'lodash';
import { ClientError } from 'graphql-request';

const REQUIRED_PERMISSIONS = [
  'customer:create',
  'customer:edit',
  'customer:read',
  'timeline:create',
  'timeline:edit',
  'timeline:read',
  'user:read',
  'workspace:read',
];

const SETUP = `\n_For full setup instructions please read <https://github.com/krivachy/plain-slack-integration/blob/main/SETUP.md|setup instructions>._`;
const USAGE = `\n*Usage is:* \`/plain configure <plain api key>\`.\n${SETUP}`;

export function slashCommand(app: App): void {
  app.command('/plain', async ({ ack, respond, body, command, logger }) => {
    logger.info('plain configure called' + JSON.stringify(command, null, 2));
    if (!/^configure\s*/.test(command.text)) {
      return await ack({
        response_type: 'ephemeral',
        text: `❌ Invalid command: \`${command.text}\`.\n${USAGE}`,
      });
    }
    const maybeApiKey = command.text.replace(/^configure\s*/, '');
    if (!/^plainApiKey_[a-zA-Z0-9_]{43}$/.test(maybeApiKey)) {
      logger.info(`Invalid Plain API key provided: ${maybeApiKey}`);
      return await ack({
        response_type: 'ephemeral',
        text: `❌ Invalid Plain API key format provided: \`${maybeApiKey}\`. ${USAGE}`,
      });
    }
    await ack();
    const apiKey = maybeApiKey;
    const sdk = initPlainSdk({ plainApiKey: apiKey, plainWorkspaceId: 'unknown' });
    let apiKeyDetails: GetApiKeyDetailsQuery;
    try {
      apiKeyDetails = (await sdk.getApiKeyDetails()).data;
    } catch (e) {
      if (e instanceof ClientError) {
        logger.info(`GraphQL client: ${JSON.stringify(e)}`);
        return await respond({
          response_type: 'ephemeral',
          text: `❌ Plain API key is not valid (401 Unauthorized). Please check the key and try again.\n${SETUP}`,
        });
      } else {
        logger.error(`Unhandled error: ${JSON.stringify(e)}`);
        throw e;
      }
    }
    if (!apiKeyDetails.myWorkspace || !apiKeyDetails.myPermissions) {
      logger.error(`Invalid Plain API response: ${JSON.stringify(apiKeyDetails, null, 2)}`);
      return await respond({
        response_type: 'ephemeral',
        text: `❌ Internal error: invalid Plain API response. Please check logs for details.\n${SETUP}`,
      });
    }

    const missingPermissions = difference(
      REQUIRED_PERMISSIONS,
      apiKeyDetails.myPermissions.permissions
    );
    if (missingPermissions.length > 0) {
      return await respond({
        response_type: 'ephemeral',
        text: `❌ API key missing the following permissions: ${missingPermissions
          .map((s) => `\`${s}\``)
          .join(
            ', '
          )}.\nPlease create a new API key that has all the required permissions: ${REQUIRED_PERMISSIONS.map(
          (s) => `\`${s}\``
        ).join(', ')}.\n${SETUP}`,
      });
    }

    const identifier = { teamId: body.team_id, enterpriseId: body.enterprise_id };
    logger.info(
      `Saving plain API key for ${JSON.stringify(identifier)} to database, workspaceId=${
        apiKeyDetails.myWorkspace.id
      }`
    );
    await savePlainApiKeyDetails(identifier, {
      plainApiKey: apiKey,
      plainWorkspaceId: apiKeyDetails.myWorkspace.id,
    });
    logger.info(
      `Saved plain API key for ${JSON.stringify(identifier)} to database, workspaceId=${
        apiKeyDetails.myWorkspace.id
      }`
    );

    await respond({
      response_type: 'ephemeral',
      text: `✅ API key configured successfully! Linked to Plain workspace <https://app.plain.com/workspace/${apiKeyDetails.myWorkspace.id}|*${apiKeyDetails.myWorkspace.name}* _(${apiKeyDetails.myWorkspace.publicName})_>`,
    });
  });
}
