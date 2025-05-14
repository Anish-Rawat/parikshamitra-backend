import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true
}))

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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
import adminAuthRouter from "./routes/admin/auth.router"
import testRouter from "./routes/admin/test.router"
import userAuthRouter from "./routes/user/auth.router"

// admin API`s
app.use('/api/v1/admin/user', userRouter)
app.use('/api/v1/admin/auth', adminAuthRouter)
app.use('/api/v1/admin/class',classRouter)
app.use('/api/v1/admin/subject',subjectRouter)
app.use('/api/v1/admin/question',questionRouter)
app.use('/api/v1/admin/test',testRouter)

// client API`s
app.use('/api/v1/client/test', testRouter);
app.use('/api/v1/client/dashboard',userRouter);
app.use('/api/v1/client/auth',userAuthRouter);
app.use('/api/v1/client/class',classRouter);
app.use('/api/v1/client/subject',subjectRouter)


export default app