import { Request, Response } from "express"
import db from "../db"
import { education, project, skill, social, users } from "../models"

export async function getPublicData(req: Request, res: Response) {
    try {
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                mobile: users.mobile,
                profile: users.profile,
            })
            .from(users)
            .limit(1)

        const skills = await db.select().from(skill)
        const projects = await db.select().from(project)
        const educationRecords = await db.select().from(education)
        const socials = await db.select().from(social)

        res.json({
            message: "public data fetched",
            result: {
                user,
                skills,
                projects,
                education: educationRecords,
                social: socials,
            },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}