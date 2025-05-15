import { Router } from "express";
import { addSubject, deleteSubject, editSubject, getSubjects } from "../controllers/subject.controller";
import { verifyJWT } from "../middlewares/admin/auth.middleware";
import { verifyAdminOrUserJWT } from "../middlewares/adminOrUser/auth.middleware";

const router = Router()

router.route('/get-subjects').get(verifyAdminOrUserJWT,getSubjects)
router.route('/add-subject').post(verifyJWT,addSubject)
router.route('/edit-subject').put(verifyJWT,editSubject)
router.route('/delete-subject').delete(verifyJWT,deleteSubject)


export default router