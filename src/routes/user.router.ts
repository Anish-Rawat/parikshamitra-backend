import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { blockUserById, getAllUsers, getDashboardTilesInfo, getUserTilesInfo } from "../controllers/user.controller";

const router = Router();

router.route("/all-users").get(verifyJWT, getAllUsers);

router.route("/get-user/:userId").get(verifyJWT, getAllUsers);

router.route("/update-status/:userId").patch(verifyJWT, blockUserById);

router.route("/get-dashboard-tiles-info").get(verifyJWT, getDashboardTilesInfo);

router.route("/get-test-info-by-id").get(verifyJWT, getUserTilesInfo);

export default router