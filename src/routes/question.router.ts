import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addQuestion, deleteQuestion, editQuestion } from "../controllers/question.controller";

const router = Router()

router.route('/add-question').post(verifyJWT,addQuestion)
router.route('/:id').put(verifyJWT,editQuestion)
router.route('/:id').delete(verifyJWT,deleteQuestion)

export default router