import { AVAILABLE_STATUS } from "@/data/invoices";
import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// The `[number]` part accesses an element of the array, but it uses the number type as the index type.
// This is a trick to refer to any element in the array.
// the type Status will be: `type Status = "open" | "paid" | "void" | "uncollectible";`
export type Status = (typeof AVAILABLE_STATUS)[number]["id"];

const statuses = AVAILABLE_STATUS.map(({ id }) => id);

// export const statusEnum = pgEnum("status", ["open", "paid", "void", "uncollectible"]);
export const statusEnum = pgEnum("status", statuses as [Status]);

export const Invoices = pgTable("invoice", {
  id: serial("id").primaryKey(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  status: statusEnum("status").notNull(),
  customerId: integer("customerId")
    .notNull()
    .references(() => Customers.id),
  userId: text("userId").notNull(),
});

export const Customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  userId: text("userId").notNull(),
});
