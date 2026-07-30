import { Router } from "express"
import { register, login, logout } from "../controllers/auth.controller"

const router = Router()

router
    .post("/register", register)
    .post("/login", login)
    .post("/logout", logout)

export default router
