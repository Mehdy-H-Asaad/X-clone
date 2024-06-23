import Notification from "../models/notifications.model";
import Post from "../models/post.model";
import User from "../models/user.model";
import { REQUEST, RESPONSE } from "../types/expressTypes";
import { v2 as cloudinary } from "cloudinary";
export const createPost = async (req: REQUEST, res: RESPONSE) => {
	try {
		const { text } = req.body;
		let { img } = req.body;

		const reqUserId = (req as any).user._id;

		const user = await User.findById(reqUserId);

		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		if (!img && !text) {
			return res
				.status(400)
				.json({ error: "The post must have text or an image" });
		}

		if (img) {
			const uploadingResponse = await cloudinary.uploader.upload(img);
			img = uploadingResponse.secure_url;
		}

		const addNewPost = new Post({
			user: reqUserId,
			img,
			text,
		});

		await addNewPost.save();
		return res.status(201).json(addNewPost);
	} catch (error) {
		console.log("Error in the createPost controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deletePost = async (req: REQUEST, res: RESPONSE) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) return res.status(404).json({ error: "Post not found" });

		if (post.user.toString() !== (req as any).user._id.toString()) {
			return res.status(400).json({ error: "User not authorized" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop()!.split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		return res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in the deletePost controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const commentOnPost = async (req: REQUEST, res: RESPONSE) => {
	try {
		const postId = req.params.id;
		const reqUserId = (req as any).user._id;
		const { text } = req.body;

		if (!text) return res.status(400).json({ error: "Text field is required" });

		const post = await Post.findById(postId);

		if (!post) return res.status(404).json({ error: "Post not found" });

		const comment = { user: reqUserId, text };

		post.comments.push(comment);

		await post.save();

		const populatedComments = await post.populate({
			path: "comments.user",
			select: "username fullname profileImg",
		});

		const updatedComments = populatedComments.comments;

		return res.status(200).json(updatedComments);
	} catch (error) {
		console.log("Error in the commentOnPost controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const likeAndUnLike = async (req: REQUEST, res: RESPONSE) => {
	try {
		const postId = req.params.id;
		const reqUserId = (req as any).user._id;

		const post = await Post.findById(postId);

		if (!post) return res.status(404).json({ error: "Post not found" });

		const isLiked = post.likes.includes(reqUserId);

		if (isLiked) {
			// UNLIKED
			await Post.updateOne({ _id: postId }, { $pull: { likes: reqUserId } });
			await User.updateOne(
				{ _id: reqUserId },
				{ $pull: { likedPosts: postId } }
			);

			const updatedLikes = post.likes.filter(
				post => post.toString() !== reqUserId.toString()
			);

			return res.status(200).json(updatedLikes);
		} else {
			post.likes.push(reqUserId);
			await User.updateOne(
				{ _id: reqUserId },
				{ $push: { likedPosts: postId } }
			);
			await Post.updateOne({ _id: postId }, { $push: { likes: reqUserId } });

			const notification = new Notification({
				sender: reqUserId,
				reciver: post.user,
				type: "like",
			});

			await notification.save();

			const updatedLikes = post.likes;
			return res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in the likeAndUnLike controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getAllPosts = async (_req: REQUEST, res: RESPONSE) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "username fullname profileImg",
			});

		if (posts.length === 0) return res.status(200).json([]);

		return res.status(200).json(posts);
	} catch (error) {
		console.log("Error in the getAllPosts controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
export const getLikedPosts = async (req: REQUEST, res: RESPONSE) => {
	try {
		const reqUserId = req.params.id;

		const user = await User.findById(reqUserId);

		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({
			_id: { $in: user.likedPosts },
		}).populate({
			path: "user",
			select: "-password",
		});

		return res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in the getLikedPosts controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getFollowingPosts = async (req: REQUEST, res: RESPONSE) => {
	try {
		const reqUserId = (req as any).user._id;

		const user = await User.findById(reqUserId);

		if (!user) return res.status(404).json({ error: "User not found" });

		const followingPosts = await Post.find({ user: { $in: user.following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			});

		return res.status(200).json(followingPosts);
	} catch (error) {
		console.log("Error in the getFollowingPosts controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getUserPosts = async (req: REQUEST, res: RESPONSE) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username: username });

		if (!user) return res.status(404).json({ error: "User not found" });

		const userPosts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "username profileImg fullname",
			});

		return res.status(200).json(userPosts);
	} catch (error) {
		console.log("Error in the getUserPosts controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
