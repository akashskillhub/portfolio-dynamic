import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core"
import { users } from "./User"

export const social = pgTable("social", {
    id: serial("id").primaryKey(),
    userId: integer("users_id").references(() => users.id),
    platform: varchar("platform", { length: 255 }),
    platformLink: varchar("platformLink", { length: 500 }),

})
