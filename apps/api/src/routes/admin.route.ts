import { Router } from "express"
import {
    createEducation,
    readEducation,
    updateEducation,
    deleteEducation,
    createSocial,
    readSocial,
    updateSocial,
    deleteSocial,
    getMe,
} from "../controllers/admin.controller"

const router = Router()

// user
router
    .get("/me", getMe)

// education
router
    .post("/education", createEducation)
    .get("/education", readEducation)
    .put("/education/:id", updateEducation)
    .delete("/education/:id", deleteEducation)

// social
router
    .post("/social", createSocial)
    .get("/social", readSocial)
    .put("/social/:id", updateSocial)
    .delete("/social/:id", deleteSocial)


export default router
