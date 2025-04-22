import express from "express"
import cors from "cors"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json())

// Routes import
import subjectRouter from "./routes/subject.router"

app.use('/api/subject',subjectRouter)

export default app