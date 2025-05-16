import { Router } from "express";
import { verifyJWT } from "../../middlewares/admin/auth.middleware";
import { addSubject, deleteSubject, editSubject, getSubjects } from "../../controllers/subject.controller";

const router = Router()

router.route('/get-subjects').get(verifyJWT,getSubjects)
router.route('/add-subject').post(verifyJWT,addSubject)
router.route('/edit-subject').put(verifyJWT,editSubject)
router.route('/delete-subject').delete(verifyJWT,deleteSubject)


export default router