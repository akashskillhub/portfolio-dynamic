import { Pool } from "pg";
import { config } from "./config";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({ connectionString: config.database_url })

export default drizzle(pool)