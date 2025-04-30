import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addQuestion, deleteQuestion, editQuestion, filterQuestion, searchQuestion } from "../controllers/question.controller";

const router = Router()

router.route('/add-question').post(verifyJWT,addQuestion)
router.route('/:id').put(verifyJWT,editQuestion)
router.route('/:id').delete(verifyJWT,deleteQuestion)
router.route('/search-question').get(verifyJWT,searchQuestion)
router.route('/filter-question').get(verifyJWT,filterQuestion)

export default router