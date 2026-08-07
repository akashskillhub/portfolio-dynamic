import dotenv from "dotenv"
import { SignOptions } from "jsonwebtoken"
dotenv.config()

const isProduction = process.env.NODE_ENV === "production"

export const config = {
    env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL,
    port: process.env.PORT,
    isProduction,
    url: isProduction
        ? process.env.FRONTEND_LIVE_URL
        : process.env.FRONTEND_LOCAL_URL,

    jwt_access_secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
    jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
    jwt_access_token_expiry: process.env.JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] || "1d",
    jwt_refresh_token_expiry: process.env.JWT_REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] || "7d",
    email: process.env.EMAIL,
    email_password: process.env.EMAIL_PASSWORD,
    otp_expiry: process.env.OTP_EXPIRY,
    auth_window_ms: process.env.AUTH_WINDOW_MS as unknown as number,
    auth_limit: process.env.AUTH_LIMIT as unknown as number,
}