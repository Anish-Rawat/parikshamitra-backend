import { Router } from "express";
import { addQuestion, deleteQuestion, editQuestion, getQuestions } from "../../controllers/question.controller";
import { verifyJWT } from "../../middlewares/admin/auth.middleware";

const router = Router()

router.route('/add-question').post(verifyJWT,addQuestion)
router.route('/edit-question').put(verifyJWT,editQuestion)
router.route('/delete-question').delete(verifyJWT,deleteQuestion)
router.route('/get-questions').get(verifyJWT,getQuestions)

export default router