import { InstallationStore } from '@slack/bolt';
import { db } from '../db/db';
import { slackInstallations } from '../db/schema/schema';
import { eq } from 'drizzle-orm';
import { getSlackIdFromInstallation } from './getSlackIdFromInstallation';
import { getSlackIdFromInstallQuery } from './getSlackIdFromInstallQuery';

export const installationStore: InstallationStore = {
  storeInstallation: async (installation, logger) => {
    const [slackId, slackType] = getSlackIdFromInstallation(installation);
    await db
      .insert(slackInstallations)
      .values({
        id: slackId,
        installation: installation,
        plainApiKey: null,
      })
      // If the installation already exists, update it
      // Can happen if the app is being reinstalled (e.g. with new permissions)
      .onConflictDoUpdate({
        where: eq(slackInstallations.id, slackId),
        set: {
          installation: installation,
        },
        target: [slackInstallations.id],
      })
      .returning();
    logger?.info(`${slackType} installation stored successfully: ${slackId}`);
  },
  fetchInstallation: async (installQuery) => {
    const [slackId, slackType] = getSlackIdFromInstallQuery(installQuery);
    const installations = await db
      .select()
      .from(slackInstallations)
      .where(eq(slackInstallations.id, slackId));
    if (installations.length > 0) {
      return installations[0].installation;
    } else {
      throw new Error(`Installation not found for ${slackType}: ${slackId}`);
    }
  },
  deleteInstallation: async (installQuery, logger) => {
    const [slackId, slackType] = getSlackIdFromInstallQuery(installQuery);
    await db.delete(slackInstallations).where(eq(slackInstallations.id, slackId));
    logger?.info(`${slackType} installation deleted successfully: ${slackId}`);
  },
};
