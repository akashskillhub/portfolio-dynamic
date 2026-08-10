import db from "../db"
import { education } from "../models"

export const educationSeed = async () => {
    try {
        const data = [
            { userId: 1, degree_year: "2016-2020", degree_college: "ABC University", degree_percent: "82.5%" },
            { userId: 1, degree_year: "2014-2016", degree_college: "XYZ Senior Secondary School", degree_percent: "88.0%" },
            { userId: 1, degree_year: "2013-2014", degree_college: "PQR High School", degree_percent: "91.2%" },
        ]
        const exist = await db.select().from(education).limit(1)
        if (exist.length > 0) {
            console.log("education already exist skipping seed");
            return
        }
        await db.insert(education).values(data)
        console.log("education seed complete");
    } catch (error) {
        console.log(error)
    }
}
