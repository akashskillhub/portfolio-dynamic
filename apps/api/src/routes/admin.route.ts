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
    createProject,
    readProjects,
    updateProject,
    deleteProject,
    createSkill,
    readSkills,
    updateSkill,
    deleteSkill,
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

// project
router
    .post("/project", uploadProfile(), createProject)
    .get("/project", readProjects)
    .put("/project/:id", uploadProfile(), updateProject)
    .delete("/project/:id", deleteProject)

// skill
router
    .post("/skill", createSkill)
    .get("/skill", readSkills)
    .put("/skill/:id", updateSkill)
    .delete("/skill/:id", deleteSkill)


export default router
