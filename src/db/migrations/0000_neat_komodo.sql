CREATE TABLE IF NOT EXISTS "slack_installations" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"installation" jsonb NOT NULL,
	"plain_api_key" varchar(500)
);
