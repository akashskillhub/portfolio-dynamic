import { Request, Response } from "express"
import db from "../db"
import { education, social, users } from "../models"
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
        const { userId, degree_year, degree_college, degree_percent } = req.body

        if (!userId || !degree_year || !degree_college || !degree_percent) {
            return res.status(400).json({ message: "all fields required" })
        }

        const [result] = await db.insert(education).values({
            userId,
            degree_year,
            degree_college,
            degree_percent,
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
        const { userId, degree_year, degree_college, degree_percent } = req.body

        const [exist] = await db.select().from(education).where(eq(education.id, Number(id))).limit(1)
        if (!exist) {
            return res.status(404).json({ message: "education not found" })
        }

        const [result] = await db.update(education)
            .set({ userId, degree_year, degree_college, degree_percent })
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
        await db.update(users).set(obj).where(eq(users.id, 1))
        const [result] = await db.select().from(users).where(eq(users.id, 1))

        res.json({ message: "profile update success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

