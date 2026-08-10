import { LOGIN_REQUEST, VERIFY_OTP_REQUEST, VERIFY_OTP_RESPONSE, REFRESH_RESPONSE } from "@repo/types"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import db from "../db"
import { users } from "../models"
import { eq, or } from "drizzle-orm"
import { config } from "../config"
import bcrypt from "bcryptjs"
import { sendEmail } from "../lib/email"
import { generateOTP } from "../lib/otp"
import { generateAccessToken, generateRefreshToken } from "../lib/jwt"

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
  const otp = generateOTP()
  const hashOtp = await bcrypt.hash(otp.toString(), 12)
  const otpExpiry = Date.now() + Number(config.otp_expiry)

  await db
    .update(users)
    .set({ otp: hashOtp, otpExpiry: new Date(otpExpiry) })
    .where(eq(users.id, exist.id))

  await sendEmail({
    to: exist.email,
    subject: "verify login otp",
    message: `your login otp is ${otp}`
  })



  res.json({ message: "Login success" })
}

export async function verifyOTP(req: Request<{}, {}, VERIFY_OTP_REQUEST>, res: Response<VERIFY_OTP_RESPONSE>) {
  try {
    const { otp, username } = req.body
    if (!otp || !username) {
      return res.status(400).json({ message: "all fields required" })
    }

    const [exist] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, username), eq(users.mobile, username)))

    if (!exist) {
      return res.status(400).json({ message: "invalid eamil / mobile" })
    }

    const verify = await bcrypt.compare(otp, exist.otp as string)

    if (!verify) {
      return res.status(400).json({ message: "invalid otp" })
    }
    if (Date.now() > Number(exist.otpExpiry)) {
      await db
        .update(users)
        .set({ otp: null, otpExpiry: null })
        .where(eq(users.id, exist.id))

      return res.status(400).json({ message: "otp expired" })
    }


    await db
      .update(users)
      .set({ otp: null, otpExpiry: null })
      .where(eq(users.id, exist.id))

    const access_token = generateAccessToken({ userId: exist.id, role: "admin" })
    const refresh_token = generateRefreshToken({ userId: exist.id, role: "admin" })

    // add in .env
    res.cookie("refreshToken", refresh_token, { maxAge: 1000 * 60 * 60 * 24 * 7 })

    res.json({
      message: "login success",
      result: {
        id: exist.id,
        email: exist.email,
        mobile: exist.mobile,
        access_token: access_token
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "something went wrong" })
  }
}


export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("refreshToken")
    res.json({ message: "Logout success" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "something went wrong" })
  }
}

export async function refresh(req: Request, res: Response<REFRESH_RESPONSE>) {
  try {
    const token = req.cookies.refreshToken as string | undefined

    if (!token) {
      return res.status(401).json({ message: "unauthorized" })
    }

    const decoded = jwt.verify(token, config.jwt_refresh_secret) as { userId: number, role: string }
    const access_token = generateAccessToken({ userId: decoded.userId, role: decoded.role })

    res.json({ message: "token refreshed", result: { access_token } })
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: "invalid token" })
  }
}
