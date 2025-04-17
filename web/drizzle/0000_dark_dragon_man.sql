-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "activegames" (
	"gameid" uuid PRIMARY KEY NOT NULL,
	"black" text NOT NULL,
	"white" text NOT NULL,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "gamehistory" (
	"gameid" uuid PRIMARY KEY NOT NULL,
	"playera" text NOT NULL,
	"playerb" text NOT NULL,
	"pgn" text NOT NULL,
	"createdat" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "__diesel_schema_migrations" (
	"version" varchar(50) PRIMARY KEY NOT NULL,
	"run_on" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

*/