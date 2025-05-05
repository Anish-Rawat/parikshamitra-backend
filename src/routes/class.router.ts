import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addClass, deleteClass, getClassesAndStreams } from "../controllers/class.controller";

const router = Router()

router.route('/add-class').post(verifyJWT,addClass);
router.route('/get-classes').get(verifyJWT,getClassesAndStreams);
router.route('/delete-class/:id').get(verifyJWT,deleteClass);

export default router