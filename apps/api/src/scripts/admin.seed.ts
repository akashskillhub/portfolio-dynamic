import dotenv from "dotenv"
import db from "../db"
import { users } from "../models"
dotenv.config()

import bcrypt from "bcryptjs"
export const adminSeed = async () => {

    const ADMIN_NAME = process.env.ADMIN_NAME
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL
    const ADMIN_MOBILE = process.env.ADMIN_MOBILE
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_MOBILE || !ADMIN_PASSWORD) {
        console.error("admin credential missing, please check .env")
        return
    }

    const exist = await db.select().from(users).limit(1)
    if (exist.length > 0) {
        console.log("admin already exist")
        return
    }
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await db.insert(users).values({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        mobile: ADMIN_MOBILE,
        password: hash
    })
    console.log("admin seed complete")


}
