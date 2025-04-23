import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { blockUserById, getAllUsers } from "../controllers/user.controller";

const router = Router();

router.route("/all-users").get(verifyJWT, getAllUsers);

router.route("/get-user/:userId").get(verifyJWT, getAllUsers);

router.route("/update-status/:userId").patch(verifyJWT, blockUserById);

export default router