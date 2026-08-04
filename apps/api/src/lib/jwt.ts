import jwt from "jsonwebtoken"
import { config } from "../config"

export const generateAccessToken = ({ userId, role }: { userId: number, role: string }) => {
    return jwt.sign({ userId, role }, config.jwt_access_secret, { expiresIn: config.jwt_access_token_expiry })
}

export const generateRefreshToken = ({ userId, role }: { userId: number, role: string }) => {
    return jwt.sign({ userId, role }, config.jwt_refresh_secret, { expiresIn: config.jwt_refresh_token_expiry })
}