import { pgTable, serial, varchar, timestamp, integer, text } from "drizzle-orm/pg-core"
import { users } from "./User"

export const project = pgTable("project", {
    id: serial("id").primaryKey(),
    userId: integer("users_id").references(() => users.id),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    technology: text("technology").array(),
    hero: text("hero"),
    category: text("category").array(),

    source_url: varchar("source_url", { length: 500 }),
    live_url: varchar("live_url", { length: 500 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
