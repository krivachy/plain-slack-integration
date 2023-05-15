import { ComponentInput, ComponentSpacerSize } from '../plain/graphql';

export function buildCustomTimelineEntry(args: {
  text: string | undefined;
  messagePermalink: string | undefined;
  teamId: string | undefined;
  channelId: string;
}): ComponentInput[] {
  return [
    {
      componentText: {
        text: args.text ?? '<no text>',
      },
    },
    {
      componentSpacer: {
        spacerSize: ComponentSpacerSize.M,
      },
    },
    {
      componentLinkButton: {
        linkButtonLabel: 'Open in Slack',
        linkButtonUrl:
          args.messagePermalink ?? `slack://channel?team=${args.teamId}&id=${args.channelId}`,
      },
    },
  ];
}
