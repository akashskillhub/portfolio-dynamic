import { Router } from "express"
import { login, logout, refresh, verifyOTP } from "../controllers/auth.controller"

const router = Router()

router
    .post("/login", login)
    .post("/verify-otp", verifyOTP)
    .post("/logout", logout)
    .post("/refresh", refresh)

export default router
