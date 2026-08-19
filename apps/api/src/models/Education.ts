import { pgTable, serial, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core"
import { users } from "./User"

export const education = pgTable("education", {
    id: serial("id").primaryKey(),
    userId: integer("users_id").references(() => users.id),

    education_name: varchar("education_name", { length: 255 }),
    percentage: varchar("percentage", { length: 255 }),
    year: varchar("year", { length: 255 }),
    isPursuing: boolean("is_pursuing").default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
