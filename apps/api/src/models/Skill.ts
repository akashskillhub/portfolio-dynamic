import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core"
import { users } from "./User"

export const skill = pgTable("skill", {
    id: serial("id").primaryKey(),
    userId: integer("users_id").references(() => users.id),

    skill_name: varchar("skill_name", { length: 255 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
