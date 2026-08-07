import { rateLimit } from "express-rate-limit"
import { config } from "../config"

export const authLimiter = rateLimit({
    windowMs: config.auth_window_ms,
    limit: config.auth_limit
})

