import { PlainSdk } from './plainSdk';
import { UpsertCustomTimelineEntryInput } from './graphql';

export async function upsertCustomTimelineEntry(
  sdk: PlainSdk,
  args: Pick<
    UpsertCustomTimelineEntryInput,
    'title' | 'customerId' | 'externalId' | 'components' | 'changeCustomerStatusToActive'
  >
): Promise<string> {
  const result = await sdk.upsertCustomTimelineEntry({
    input: {
      ...args,
      sendCustomTimelineEntryCreatedNotification: false,
    },
  });
  if (result.data.upsertCustomTimelineEntry.error) {
    throw new Error(
      `Error upserting custom timeline entry: ${JSON.stringify(
        result.data.upsertCustomTimelineEntry.error
      )}`
    );
  }
  if (!result.data.upsertCustomTimelineEntry.timelineEntry) {
    throw new Error(`Custom timeline entry not returned`);
  }
  return result.data.upsertCustomTimelineEntry.timelineEntry.id;
}
