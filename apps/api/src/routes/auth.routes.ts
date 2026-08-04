import { Router } from "express"
import { login, logout, verifyOTP } from "../controllers/auth.controller"

const router = Router()

router
    .post("/login", login)
    .post("/verify-otp", verifyOTP)
    .post("/logout", logout)

export default router
