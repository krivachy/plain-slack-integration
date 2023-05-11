# Plain Support Slack Integration

A small Slack app that allows you to add or log Slack messages to a Plain customer.

## Installation

Please see 👉 [SETUP.md](./SETUP.md) 👈 for instructions on how to install this Slack app into your own workspace.

## Development 

### Requirements
- Node 18 (`nvm install 18 && nvm use 18`)
- pnpm 8 (`npm install -g pnpm@8`)
- postgres 15 (`brew install postgresql@15 && brew services start postgresql@15`)
- [ngrok](https://ngrok.com/download) or [localtunnel](https://localtunnel.me) to handle Slack webhooks

### Setting up your local environment

You'll need to configure a Slack app and a local database to run this app locally.

Copy the `.env.sample` file to `.env` and fill in the following values:

```bash
cp .env.sample .env
```

- `SLACK_CLIENT_ID` - Slack the slack client ID (can be found under Basic Information)
- `SLACK_CLIENT_SECRET` - Slack client secret (can be found under Basic Information)
- `SLACK_SIGNING_SECRET` - Slack signing secret (can be found under Basic Information)
- `BASE_DOMAIN` - the ngrok or localtunnel https URL (e.g. `https://<random chars>.ngrok-free.app`)
- (optional) `DATABASE_URL` - the full DB URL if you don't want to use the default locally (defaults to `postgres://localhost:5432/postgres`)

Slack app configuration (replace `<LOCAL_URL>` with your ngrok or localtunnel host):

```yaml
display_information:
  name: Plain Support (Development)
  description: To develop the Plain Support app.
  background_color: "#1c1c1c"
features:
  bot_user:
    display_name: Plain Support (Development)
    always_online: false
  shortcuts:
    - name: Add to Plain
      type: message
      callback_id: add_to_plain
      description: Adds the message to customer's timeline in Plain and moves the customer to the waiting for help queue.
    - name: Log to Plain
      type: message
      callback_id: log_to_plain
      description: Logs the message to a customer's timeline in Plain without moving them to the waiting for help queue.
  slash_commands:
    - command: /plain
      url: https://<LOCAL_URL>/slack/events
      description: Configure Plain API key
      usage_hint: configure <api key>
      should_escape: false
oauth_config:
  redirect_urls:
    - https://<LOCAL_URL>/slack/oauth_redirect
  scopes:
    bot:
      - chat:write
      - commands
settings:
  interactivity:
    is_enabled: true
    request_url: https://<LOCAL_URL>/slack/events
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```
