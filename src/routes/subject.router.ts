import { Router } from "express";
import { addSubject, deleteSubject, editSubject, getSubjects } from "../controllers/subject.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()

router.route('/subjects').get(verifyJWT,getSubjects)
router.route('/add-subject').post(verifyJWT,addSubject)
router.route('/:id').put(verifyJWT,editSubject)
router.route('/delete-subject').delete(verifyJWT,deleteSubject)


export default router