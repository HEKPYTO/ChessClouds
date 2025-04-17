import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const activegames = pgTable("activegames", {
	gameid: uuid().primaryKey().notNull(),
	black: text().notNull(),
	white: text().notNull(),
	createdat: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const gamehistory = pgTable("gamehistory", {
	gameid: uuid().primaryKey().notNull(),
	playera: text().notNull(),
	playerb: text().notNull(),
	pgn: text().notNull(),
	createdat: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const dieselSchemaMigrations = pgTable("__diesel_schema_migrations", {
	version: varchar({ length: 50 }).primaryKey().notNull(),
	runOn: timestamp("run_on", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});
