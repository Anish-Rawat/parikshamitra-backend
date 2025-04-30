import { Router } from "express";
import { createTest, deleteTest, getTest } from "../controllers/test.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route('/create-test').post(verifyJWT, createTest);

router.route('/get-test').get(verifyJWT, getTest);

router.route('/delete-test/:testId').delete(verifyJWT, deleteTest);

router.route('/get-test/:testId').get(verifyJWT, getTest);
export default router;