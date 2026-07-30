import "dotenv/config"
import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message: "API running successfully" })
})
app.use("/auth", authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app