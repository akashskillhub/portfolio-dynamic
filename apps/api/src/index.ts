import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes"
import adminRoutes from "./routes/admin.route"
import { config } from "./config"
import { authLimiter } from "./lib/limiter"
import { authMiddleware } from "./middleware/auth.middleware"

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.json({ message: "API running successfully" })
})
app.use("/auth", authLimiter, authRoutes)
app.use("/admin", adminRoutes)

const PORT = config.port

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config.env} mode , frontend ${config.url}`)
})

export default app