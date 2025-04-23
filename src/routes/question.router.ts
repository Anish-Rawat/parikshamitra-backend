import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addQuestion } from "../controllers/question.controller";

const router = Router()

router.route('/add-question').post(verifyJWT,addQuestion)

export default router