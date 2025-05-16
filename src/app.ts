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
import subjectRouter from "./routes/admin/subject.router"
import userSubjectRouter from "./routes/user/subject.router"
import questionRouter from "./routes/admin/question.router"
import userQuestionRouter from "./routes/user/question.router"
import classRouter from "./routes/admin/class.router"
import userClassRouter from "./routes/user/class.router"
import adminAuthRouter from "./routes/admin/auth.router"
import adminTestRouter from "./routes/admin/test.router"
import userAuthRouter from "./routes/user/auth.router"
import userTestRouter from "./routes/user/test.router"
import userRouter from "./routes/user/user.router";
import adminRouter from "./routes/admin/user.router";

// admin API`s
app.use('/api/v1/admin/user', adminRouter)
app.use('/api/v1/admin/auth', adminAuthRouter)
app.use('/api/v1/admin/class',classRouter)
app.use('/api/v1/admin/subject',subjectRouter)
app.use('/api/v1/admin/question',questionRouter)
app.use('/api/v1/admin/test',adminTestRouter)

// client API`s
app.use('/api/v1/client/dashboard',userRouter);
app.use('/api/v1/client/auth',userAuthRouter);
app.use('/api/v1/client/class',userClassRouter);
app.use('/api/v1/client/subject',userSubjectRouter)
app.use('/api/v1/client/question',userQuestionRouter)
app.use('/api/v1/client/test', userTestRouter);


export default app