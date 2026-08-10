import db from "../db"
import { social } from "../models"

export const socialSeed = async () => {
    try {
        const data = [
            { userId: 1, platform: "github", platformLink: process.env.GITHUB_URL },
            { userId: 1, platform: "linkedin", platformLink: process.env.LINKEDIN_URL },
        ]
        const exist = await db.select().from(social).limit(1)
        if (exist.length > 0) {
            console.log("social already exist skipping seed");
            return
        }
        await db.insert(social).values(data)
        console.log("social seed complete");
    } catch (error) {
        console.log(error)
    }
}