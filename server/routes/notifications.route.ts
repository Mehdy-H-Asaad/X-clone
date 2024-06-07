import express from "express";
import { protectedRoute } from "../middlewares/ProtectedRoute";
import {
	deleteNotifications,
	getNotifications,
} from "../controllers/notification.controller";

const router = express.Router();

router
	.route("/")
	.get(protectedRoute, getNotifications)
	.delete(protectedRoute, deleteNotifications);

export default router;
