import { Request, Response } from "express"
import db from "../db"
import { education, project, skill, social, users } from "../models"
import { eq } from "drizzle-orm"
import cloud from "../lib/cloud"

// ==================== USER ====================

export async function getMe(req: Request, res: Response) {
    try {
        const userId = req.user?.userId

        if (!userId) {
            return res.status(401).json({ message: "unauthorized" })
        }

        const [result] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                mobile: users.mobile,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1)

        if (!result) {
            return res.status(404).json({ message: "user not found" })
        }

        res.json({ message: "user fetched", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

// ==================== EDUCATION CRUD ====================

export async function createEducation(req: Request<{}, {}, typeof education.$inferInsert>, res: Response) {
    try {
        const { userId, education_name, percentage, year, isPursuing } = req.body

        if (!userId || !education_name) {
            return res.status(400).json({ message: "all fields required" })
        }

        const [result] = await db.insert(education).values({
            userId,
            education_name,
            percentage,
            year,
            isPursuing,
        }).returning()

        res.status(201).json({ message: "education created", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function readEducation(req: Request, res: Response) {
    try {
        const result = await db.select().from(education)
        res.json({ message: "education fetched", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function updateEducation(req: Request<{ id: string }, {}, Partial<typeof education.$inferInsert>>, res: Response) {
    try {
        const { id } = req.params
        const { userId, education_name, percentage, year, isPursuing } = req.body

        const [exist] = await db.select().from(education).where(eq(education.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "education not found" })
        }

        const [result] = await db.update(education)
            .set({ userId, education_name, percentage, year, isPursuing })
            .where(eq(education.id, Number(id)))
            .returning()

        res.json({ message: "education updated", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function deleteEducation(req: Request<{ id: string }>, res: Response) {
    try {
        const { id } = req.params

        const [exist] = await db.select().from(education).where(eq(education.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "education not found" })
        }

        await db.delete(education).where(eq(education.id, Number(id)))
        res.json({ message: "education deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

// ==================== SOCIAL CRUD ====================

export async function createSocial(req: Request<{}, {}, typeof social.$inferInsert>, res: Response) {
    try {
        const { userId, platform, platformLink } = req.body

        if (!userId || !platform || !platformLink) {
            return res.status(400).json({ message: "all fields required" })
        }

        const [result] = await db.insert(social).values({
            userId,
            platform,
            platformLink,
        }).returning()

        res.status(201).json({ message: "social created", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function readSocial(req: Request, res: Response) {
    try {
        const result = await db.select().from(social)
        res.json({ message: "social fetched", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function updateSocial(req: Request<{ id: string }, {}, Partial<typeof social.$inferInsert>>, res: Response) {
    try {
        const { id } = req.params
        const { userId, platform, platformLink } = req.body

        const [exist] = await db.select().from(social).where(eq(social.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "social not found" })
        }

        const [result] = await db.update(social)
            .set({ userId, platform, platformLink })
            .where(eq(social.id, Number(id)))
            .returning()

        res.json({ message: "social updated", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function deleteSocial(req: Request<{ id: string }>, res: Response) {
    try {
        const { id } = req.params

        const [exist] = await db.select().from(social).where(eq(social.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "social not found" })
        }

        await db.delete(social).where(eq(social.id, Number(id)))
        res.json({ message: "social deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}



export async function updateAdminProfile(req: Request, res: Response) {
    try {
        // let profile
        const { name, email, mobile } = req.body
        const obj: {
            name?: string,
            email?: string,
            mobile?: string,
            profile?: string
        } = {}
        if (name) {
            obj["name"] = name
        }
        if (email) {
            obj["email"] = email
        }
        if (mobile) {
            obj["mobile"] = mobile
        }
        if (req.file) {
            const { secure_url } = await cloud.uploader.upload(req.file.path)
            obj.profile = secure_url
        }
        await db.update(users).set(obj).where(eq(users.id, req.user?.userId ?? 1))
        const [result] = await db.select().from(users).where(eq(users.id, req.user?.userId ?? 1))

        res.json({ message: "profile update success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

// ==================== SKILL CRUD ====================

export async function createSkill(req: Request<{}, {}, typeof skill.$inferInsert>, res: Response) {
    try {
        const { userId, skill_name } = req.body

        if (!userId || !skill_name) {
            return res.status(400).json({ message: "all fields required" })
        }

        const [result] = await db.insert(skill).values({
            userId,
            skill_name,
        }).returning()

        res.status(201).json({ message: "skill created", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function readSkills(req: Request, res: Response) {
    try {
        const result = await db.select().from(skill)
        res.json({ message: "skills fetched", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function updateSkill(req: Request<{ id: string }, {}, Partial<typeof skill.$inferInsert>>, res: Response) {
    try {
        const { id } = req.params
        const { userId, skill_name } = req.body

        const [exist] = await db.select().from(skill).where(eq(skill.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "skill not found" })
        }

        const [result] = await db.update(skill)
            .set({ userId, skill_name })
            .where(eq(skill.id, Number(id)))
            .returning()

        res.json({ message: "skill updated", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function deleteSkill(req: Request<{ id: string }>, res: Response) {
    try {
        const { id } = req.params

        const [exist] = await db.select().from(skill).where(eq(skill.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "skill not found" })
        }

        await db.delete(skill).where(eq(skill.id, Number(id)))
        res.json({ message: "skill deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

// ==================== PROJECT CRUD ====================

function toArray(value: unknown): string[] | undefined {
    if (value === undefined) return undefined
    if (Array.isArray(value)) return value
    return value === "" ? [] : [value as string]
}

export async function createProject(req: Request<{}, {}, typeof project.$inferInsert>, res: Response) {
    try {
        const { userId, name, description, source_url, live_url } = req.body
        const technology = toArray(req.body.technology)
        const category = toArray(req.body.category)

        if (!userId || !name) {
            return res.status(400).json({ message: "userId and name are required" })
        }

        let hero: string | undefined
        if (req.file) {
            const { secure_url } = await cloud.uploader.upload(req.file.path)
            hero = secure_url
        }

        const [result] = await db.insert(project).values({
            userId,
            name,
            description,
            technology,
            category,
            source_url,
            live_url,
            hero,
        }).returning()

        res.status(201).json({ message: "project created", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function readProjects(req: Request, res: Response) {
    try {
        const result = await db.select().from(project)
        res.json({ message: "projects fetched", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function updateProject(req: Request<{ id: string }, {}, Partial<typeof project.$inferInsert>>, res: Response) {
    try {
        const { id } = req.params
        const { userId, name, description, source_url, live_url } = req.body
        const technology = toArray(req.body.technology)
        const category = toArray(req.body.category)

        const [exist] = await db.select().from(project).where(eq(project.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "project not found" })
        }

        const obj: {
            userId?: number,
            name?: string,
            description?: string | null,
            technology?: string[] | null,
            category?: string[] | null,
            source_url?: string | null,
            live_url?: string | null,
            hero?: string
        } = {}
        if (userId) obj.userId = userId
        if (name) obj.name = name
        if (description) obj.description = description
        if (technology) obj.technology = technology
        if (category) obj.category = category
        if (source_url) obj.source_url = source_url
        if (live_url) obj.live_url = live_url

        if (req.file) {
            const { secure_url } = await cloud.uploader.upload(req.file.path)
            obj.hero = secure_url
        }

        const [result] = await db.update(project)
            .set(obj)
            .where(eq(project.id, Number(id)))
            .returning()

        res.json({ message: "project updated", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

export async function deleteProject(req: Request<{ id: string }>, res: Response) {
    try {
        const { id } = req.params

        const [exist] = await db.select().from(project).where(eq(project.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "project not found" })
        }

        await db.delete(project).where(eq(project.id, Number(id)))
        res.json({ message: "project deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

