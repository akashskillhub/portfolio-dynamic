import { Router } from "express"
import { getPublicData } from "../controllers/public.controller"

const router = Router()

router
    .get("/", getPublicData)

export default router