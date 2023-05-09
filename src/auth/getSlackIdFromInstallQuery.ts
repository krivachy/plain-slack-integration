import { InstallationQuery } from '@slack/bolt';

export function getSlackIdFromInstallQuery(
  installQuery: InstallationQuery<boolean>
): [string, 'team' | 'enterprise'] {
  if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
    return [installQuery.enterpriseId, 'enterprise'];
  }
  if (installQuery.teamId !== undefined) {
    return [installQuery.teamId, 'team'];
  }
  throw new Error('Failed to determine slack id from install query');
}
