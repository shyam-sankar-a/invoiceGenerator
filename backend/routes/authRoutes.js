import express from "express";
import registerUser from "../controllers/auth/registerController.js";
import verifyUserEmail from "../controllers/auth/verifyUserEmailController.js";
import loginUser from "../controllers/auth/loginController.js";
import { loginLimiter } from "../middleware/apiLimiter.js";
import resendVerifyEmail from "../controllers/auth/resetVerifyEmailController.js";
import {resetPasswordRequest, resetPassword} from "../controllers/auth/resetPasswordController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:emailToken/:userId", verifyUserEmail);
router.post("/login", loginLimiter, loginUser);
router.post("/resend_email_token", resendVerifyEmail);
router.post("/reset_passsword_request", resetPasswordRequest);
router.post("/reset_passsword", resetPassword);

export default router;