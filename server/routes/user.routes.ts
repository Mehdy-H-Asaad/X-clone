import express from "express";
import { protectedRoute } from "../middlewares/ProtectedRoute";
import {
	getSuggestedUser,
	getUserProfile,
	handleFollowing,
	updateUser,
} from "../controllers/user.controller";

const router = express.Router();

router.route("/profile/:username").get(protectedRoute, getUserProfile);
router.route("/suggested").get(protectedRoute, getSuggestedUser);
router.route("/follow/:id").post(protectedRoute, handleFollowing);
router.route("/update").post(protectedRoute, updateUser);

export default router;
