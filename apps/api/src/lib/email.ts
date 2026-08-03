import nodemailer from "nodemailer"
import { config } from "../config"

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.email, pass: config.email_password }
})

export const sendEmail = async ({ to, subject, message }: { to: string, subject: string, message: string }) => {
    try {
        await transport.sendMail({
            to,
            subject,
            html: message,
        })

        console.log("email send success")

    } catch (error) {
        console.log(error)
    }
}