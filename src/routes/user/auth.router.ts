import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../../controllers/user/auth.controller";
import { verifyJWT } from "../../middlewares/user/auth.middleware";

const router = Router();
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

// router.route('/get-user-by-email/:email').get(getUserInfoByEmail);

export default router;