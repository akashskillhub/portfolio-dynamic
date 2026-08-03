import { LOGIN_REQUEST } from "@repo/types"
import { Request, Response } from "express"
import db from "../db"
import { users } from "../models"
import { eq, or } from "drizzle-orm"
import { config } from "../config"
import bcrypt from "bcryptjs"
import { sendEmail } from "../lib/email"

export async function login(req: Request<{}, {}, LOGIN_REQUEST>, res: Response) {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(401).json({ message: "all fields required" })
  }
  // step1 check if username exist in in email or mobile

  const [exist] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, username), eq(users.mobile, username)))
    .limit(1)

  if (!exist) {
    return res.status(401).json({
      message:
        config.isProduction
          ? "invalid credential"
          : "invalid email / mobile"
    })
  }

  const verify = await bcrypt.compare(password, exist.password)
  if (!verify) {
    return res.status(401).json({
      message:
        config.isProduction
          ? "invalid credential"
          : "invalid password"
    })
  }

  // email otp logic
  await sendEmail({
    to: exist.email,
    subject: "verify login otp",
    message: "your login otp is 123456"
  })



  res.json({ message: "Login success" })
}

export async function logout(req: Request, res: Response) {
  res.json({ message: "Logout success" })
}
