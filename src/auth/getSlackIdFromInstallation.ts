import { Installation } from '@slack/bolt';

export function getSlackIdFromInstallation(
  installation: Installation
): [string, 'team' | 'enterprise'] {
  if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
    return [installation.enterprise.id, 'enterprise'];
  }
  if (installation.team !== undefined) {
    return [installation.team.id, 'team'];
  }
  throw new Error('Failed to determine slack id from installation');
}
