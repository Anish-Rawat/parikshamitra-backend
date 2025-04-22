import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";

const router = Router()
router.route("/register-user").post(registerUser);

export default router