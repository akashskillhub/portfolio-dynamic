import dotenv from "dotenv"
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

    jwt_access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET
}