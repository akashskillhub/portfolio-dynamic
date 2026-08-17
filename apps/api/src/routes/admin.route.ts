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
    updateAdminProfile,
} from "../controllers/admin.controller"
import { uploadProfile } from "../lib/upload"

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

router
    .post("/update-profile", uploadProfile(), updateAdminProfile)


export default router
