/* eslint-disable no-console */
/* eslint-disable import/no-internal-modules */
import './utils/env';
import { App, LogLevel } from '@slack/bolt';
import { installationStore } from './auth/installationStore';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db/db';
import { shortcut } from './slack/shortcut';
import { slashCommand } from './slack/slashCommand';
import { z } from 'zod';
import { assert } from 'assert-ts';

const baseDomain = z
  .string()
  .url('BASE_DOMAIN must be a valid URL')
  .transform((s) => s.replace(/\/$/, ''))
  .parse(assert(process.env.BASE_DOMAIN, 'BASE_DOMAIN environment variable not set'));

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['channels:history', 'chat:write', 'commands', 'users:read'],
  logLevel: LogLevel.DEBUG,
  installationStore,
  redirectUri: `${baseDomain}/slack/oauth_redirect`,
  installerOptions: {
    redirectUriPath: '/slack/oauth_redirect',
  },
});

slashCommand(app);
shortcut(app);

(async () => {
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  await app.start(Number(process.env.PORT) || 3000);

  console.log('⚡️ Bolt app is running!');
})();
