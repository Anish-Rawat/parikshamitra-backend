import { Router } from "express";
import { addSubject, deleteSubject, editSubject } from "../controllers/subject.controller";

const router = Router()

router.route('/add-subject').post(addSubject)
router.route('/:id').put(editSubject)
router.route('/:id').delete(deleteSubject)


export default router