import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
    limit: "20kb",
}));

app.use(cookieParser());

// Routes import
import subjectRouter from "./routes/subject.router"
import userRouter from "./routes/user.router"
import questionRouter from "./routes/question.router"
import classRouter from "./routes/class.router"

app.use('/api/v1/auth', userRouter)
app.use('/api/v1/class',classRouter)
app.use('/api/v1/subject',subjectRouter)
app.use('/api/v1/question',questionRouter)

export default app