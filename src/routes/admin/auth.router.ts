import { Router } from "express";
import { getUserInfoByEmail, loginUser, logoutUser, refreshAccessToken, registerUser } from "../../controllers/admin/auth.controller";
import { verifyJWT } from "../../middlewares/admin/auth.middleware";

const router = Router();
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route('/get-user-by-email/:email').get(getUserInfoByEmail);

router.route('/refresh-token').get(refreshAccessToken);

export default router;