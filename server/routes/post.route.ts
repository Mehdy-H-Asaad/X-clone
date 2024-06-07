import express from "express";
import { protectedRoute } from "../middlewares/ProtectedRoute";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeAndUnLike,
} from "../controllers/post.controller";

const router = express.Router();

router.route("/create").post(protectedRoute, createPost);
router.route("/:id").delete(protectedRoute, deletePost);
router.route("/comment/:id").post(protectedRoute, commentOnPost);
router.route("/like/:id").post(protectedRoute, likeAndUnLike);
router.route("/allposts").get(protectedRoute, getAllPosts);
router.route("/likedposts/:id").get(protectedRoute, getLikedPosts);
router.route("/followingposts").get(protectedRoute, getFollowingPosts);
router.route("/userposts/:username").get(protectedRoute, getUserPosts);
export default router;
