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
import userRouter from "./routes/user.router"

app.use('/api/v1/subject',subjectRouter)
app.use('/api/v1/auth', userRouter)

export default app