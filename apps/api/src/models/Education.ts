import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core"
import { users } from "./User"

export const education = pgTable("education", {
    id: serial("id").primaryKey(),
    userId: integer("users_id").references(() => users.id),
    degree_year: varchar("degree_year", { length: 255 }),
    degree_college: varchar("degree_college", { length: 255 }),
    degree_percent: varchar("degree_percent", { length: 255 }),

})
