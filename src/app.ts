import express from "express"
import cors from "cors"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json())
app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
  });
  
// Routes import
import subjectRouter from "./routes/subject.router"

app.use('/api/v1/subject',subjectRouter)

export default app