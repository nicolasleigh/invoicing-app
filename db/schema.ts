import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["open", "paid", "void", "uncollectible"]);

export const Invoices = pgTable("invoice", {
  id: serial("id").primaryKey(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  status: statusEnum("status").notNull(),
  userId: text("userId").notNull(),
});
