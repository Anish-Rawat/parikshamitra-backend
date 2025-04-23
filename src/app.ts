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
import authRouter from "./routes/auth.router"

app.use('/api/v1/admin/subject',subjectRouter)
app.use('/api/v1/admin/auth', authRouter)
app.use('/api/v1/admin/user', userRouter)
export default app