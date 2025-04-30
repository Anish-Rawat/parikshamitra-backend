import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addClass, getClassesAndStreams } from "../controllers/class.controller";

const router = Router()

router.route('/add-class').post(verifyJWT,addClass);

router.route('/get-classes').get(verifyJWT,getClassesAndStreams);
export default router