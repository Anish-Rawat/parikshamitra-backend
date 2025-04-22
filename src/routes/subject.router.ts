import { Router } from "express";
import { addSubject, editSubject } from "../controllers/subject.controller";

const router = Router()

router.route('/add-subject').post(addSubject)
router.route('/:id').put(editSubject)
router.route('/:id').delete(addSubject)


export default router