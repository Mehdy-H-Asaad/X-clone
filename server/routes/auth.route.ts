import express from "express";
import {
	getTheAuthUser,
	login,
	logout,
	signup,
} from "../controllers/auth.controller";
import { protectedRoute } from "../middlewares/ProtectedRoute";

const router = express.Router();

router.route("/authuser").get(protectedRoute, getTheAuthUser);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
