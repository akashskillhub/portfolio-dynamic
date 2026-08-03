import "dotenv/config"
import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import { config } from "./config"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message: "API running successfully" })
})
app.use("/auth", authRoutes)

const PORT = config.port

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config.env} mode , frontend ${config.url}`)
})

export default app