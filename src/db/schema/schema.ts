import { jsonb, pgTable, varchar } from 'drizzle-orm/pg-core';
import { Installation } from '@slack/bolt';

export const slackInstallations = pgTable('slack_installations', {
  // Can either be team_id or enterprise_id depending on isEnterpriseInstall
  id: varchar('id', { length: 100 }).primaryKey(),
  installation: jsonb('installation').$type<Installation>().notNull(),
  plainApiKey: varchar('plain_api_key', { length: 100 }),
  plainWorkspaceId: varchar('plain_workspace_id', { length: 100 }),
});
