ALTER TABLE "slack_installations" ALTER COLUMN "plain_api_key" SET DATA TYPE varchar(100);
ALTER TABLE "slack_installations" ADD COLUMN "plain_workspace_id" varchar(100);