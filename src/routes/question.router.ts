import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addQuestion, deleteQuestion, editQuestion, filterQuestion, getQuestions, searchQuestion } from "../controllers/question.controller";

const router = Router()

router.route('/add-question').post(verifyJWT,addQuestion)
router.route('/:id').put(verifyJWT,editQuestion)
router.route('/delete-question').delete(verifyJWT,deleteQuestion)
router.route('/search-question').get(verifyJWT,searchQuestion)
router.route('/filter-question').get(verifyJWT,filterQuestion)
router.route('/get-questions').get(verifyJWT,getQuestions)

export default router