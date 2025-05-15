import { Router } from "express";
import {
  deleteTest,
  getTest,
  getTestInfoByUserId,
} from "../../controllers/test.controller";
import { verifyJWT } from "../../middlewares/admin/auth.middleware";

const router = Router();

router.route("/get-test").get(verifyJWT, getTest);

router.route("/delete-test/:testId").delete(verifyJWT, deleteTest);

router.route("/get-test/:testId").get(verifyJWT, getTest);

router.route("/get-test-by-userId/:userId").get(verifyJWT, getTestInfoByUserId);

export default router;
