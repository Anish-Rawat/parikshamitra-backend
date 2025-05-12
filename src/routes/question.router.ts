import { Router } from "express";
import { verifyJWT } from "../middlewares/user/auth.middleware";
import { addQuestion, deleteQuestion, editQuestion, getQuestions } from "../controllers/question.controller";

const router = Router()

router.route('/add-question').post(verifyJWT,addQuestion)
router.route('/edit-question').put(verifyJWT,editQuestion)
router.route('/delete-question').delete(verifyJWT,deleteQuestion)
router.route('/get-questions').get(verifyJWT,getQuestions)

export default router