import { Router } from "express";
import { verifyJWT } from "../middlewares/admin/auth.middleware";
import { addClass, deleteClass, editClass, getClassesAndStreams } from "../controllers/class.controller";
import { verifyAdminOrUserJWT } from "../middlewares/adminOrUser/auth.middleware";

const router = Router()

router.route('/add-class').post(verifyJWT,addClass);
router.route('/get-classes').get(verifyAdminOrUserJWT,getClassesAndStreams);
router.route('/delete-class').delete(verifyJWT,deleteClass);
router.route('/edit-class').put(verifyJWT,editClass);

export default router