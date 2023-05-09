import { App } from '@slack/bolt';
import { savePlainApiKeyDetails } from '../db/plainApiKey';

export function slashCommand(app: App): void {
  app.command('/plain', async ({ ack, body, command, logger }) => {
    logger.info('plain configure called' + JSON.stringify(command, null, 2));
    if (!/^configure\s*/.test(command.text)) {
      return await ack({
        response_type: 'ephemeral',
        text: 'Invalid command, valid commands are `/plain configure <workspace id> <plain api key>`',
      });
    }
    const maybeApiKey = command.text.replace(/^configure\s*/, '');
    if (
      !/^w_[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}\splainApiKey_[a-zA-Z0-9_]{43}$/.test(maybeApiKey)
    ) {
      logger.info(`Invalid workspace ID + plain API key provided: ${maybeApiKey}`);
      return await ack({
        response_type: 'ephemeral',
        text: `Invalid workspace ID and plain API key provided: ${maybeApiKey}`,
      });
    }
    const [workspaceId, apiKey] = maybeApiKey.split(' ');

    const identifier = { teamId: body.team_id, enterpriseId: body.enterprise_id };
    logger.info(`Saving plain API key for ${JSON.stringify(identifier)} to database`);
    await savePlainApiKeyDetails(identifier, {
      plainApiKey: apiKey,
      plainWorkspaceId: workspaceId,
    });
    logger.info(`Saved plain API key for ${JSON.stringify(identifier)} to database`);

    await ack({
      response_type: 'ephemeral',
      text: `✅ API key configured successfully!`,
    });
  });
}
