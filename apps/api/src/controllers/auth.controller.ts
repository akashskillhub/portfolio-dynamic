import { REGISTER_REQUEST, REGISTER_RESPONSE } from "@repo/types"
import { Request, Response } from "express"
import db from "../db"
import { users } from "../models"
import { eq, or } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function register(req: Request<{}, {}, REGISTER_REQUEST>, res: Response<REGISTER_RESPONSE>) {
  try {
    const { email, name, password, mobile } = req.body

    // check if email or mobile already exist
    const exist = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, email),
          eq(users.mobile, mobile),
        )
      ).limit(1)

    if (exist.length > 0) {
      return res.status(409).json({ message: "email or mobile already registered with us" })
    }
    // check password of 8 length
    if (password.length < 8) {
      return res.status(400).json({ message: "weak password, please use at least 8 characters" })
    }
    // hash password

    const hash = await bcrypt.hash(password, 12)
    await db.insert(users).values({ name, email, mobile, password: hash })
    res.json({ message: "Register success" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "unable to register" })
  }
}

export async function login(req: Request, res: Response) {
  res.json({ message: "Login success" })
}

export async function logout(req: Request, res: Response) {
  res.json({ message: "Logout success" })
}
