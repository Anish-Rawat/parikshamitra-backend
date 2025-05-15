import { Router } from "express";
import {
  createTest,
  submitTest,
} from "../../controllers/test.controller";
import { verifyJWT } from "../../middlewares/user/auth.middleware";

const router = Router();

router.route("/create-test").post(verifyJWT, createTest);

router.route("/submit-test").post(verifyJWT, submitTest);

export default router;
