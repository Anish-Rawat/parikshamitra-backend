import { Router } from "express";
import { addSubject } from "../controllers/subject.controller";

const router = Router()

router.route('/add-subject').post(addSubject)
export default router