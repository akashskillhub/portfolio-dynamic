import { rateLimit } from "express-rate-limit"
import { config } from "../config"

export const authLimiter = rateLimit({
    windowMs: Number(config.auth_window_ms),
    limit: Number(config.auth_limit)
})

