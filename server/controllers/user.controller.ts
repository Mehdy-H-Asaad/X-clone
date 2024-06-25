import { Types } from "mongoose";
import User from "../models/user.model";
import { REQUEST, RESPONSE } from "../types/expressTypes";
import Notification from "../models/notifications.model";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req: REQUEST, res: RESPONSE) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username }).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in the getUserProfile controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const handleFollowing = async (req: REQUEST, res: RESPONSE) => {
	try {
		const { id } = req.params;
		const reqUserId = (req as any).user._id;
		const inspectedUser = await User.findById(id);
		const currentUser = await User.findById(reqUserId);

		if (id == reqUserId)
			return res
				.status(400)
				.json({ error: "You can not follow/unfollow your own account" });

		if (!inspectedUser || !currentUser) {
			return res.status(404).json({ error: "User not found" });
		}

		const idToObjectId = new Types.ObjectId(id);

		const isFollowing = currentUser.following.includes(idToObjectId);

		if (isFollowing) {
			// UNFOLLOW LOGIC
			await User.findByIdAndUpdate(id, { $pull: { followers: reqUserId } });
			await User.findByIdAndUpdate(reqUserId, { $pull: { following: id } });
			return res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			await User.findByIdAndUpdate(id, { $push: { followers: reqUserId } });
			await User.findByIdAndUpdate(reqUserId, { $push: { following: id } });

			const newnotification = new Notification({
				sender: reqUserId,
				reciver: id,
				type: "follow",
			});

			await newnotification.save();

			return res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in the handleFollowing controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getSuggestedUser = async (req: REQUEST, res: RESPONSE) => {
	try {
		const userReqId = (req as any).user._id;

		const user = await User.findById(userReqId).select("following");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const followingUsers = user.following;

		const suggestedUsers = await User.aggregate([
			{
				$match: {
					_id: { $ne: userReqId, $nin: followingUsers },
				},
			},
			{
				$sample: { size: 10 },
			},
			{
				$project: {
					password: 0, // Exclude password field
				},
			},
		]).limit(4); // Limit to 4 users

		return res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in the getSuggestedUser controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateUser = async (req: REQUEST, res: RESPONSE) => {
	const { username, email, fullname, currentPassword, newPassword, bio, link } =
		req.body;

	let { profileImg, coverImg } = req.body;

	const reqUserId = (req as any).user._id;

	try {
		let user = await User.findById(reqUserId);
		if (!user) return res.status(404).json({ error: "User not found" });

		if ((!newPassword && currentPassword) || (newPassword && !currentPassword))
			return res.status(400).json({
				error: "Both current password and new password must be provided",
			});

		if (currentPassword && newPassword) {
			const isMatched = bcrypt.compare(currentPassword, user.password);

			if (!isMatched)
				return res.status(400).json({ error: "Password is not correct" });

			if (newPassword.length < 6)
				return res
					.status(400)
					.json({ error: "Password must be at least 6 characters" });

			user.password = await bcrypt.hash(newPassword, 10);
		}

		if (profileImg) {
			if (user.profileImg)
				await cloudinary.uploader.destroy(
					user.profileImg.split("/").pop()!.split(".")[0]
				); // Get id image to destroy

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg)
				await cloudinary.uploader.destroy(
					user.coverImg.split("/").pop()!.split(".")[0]
				); // Get id image to destroy

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullname = fullname || user.fullname;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		await user.save();
		user = await User.findById(reqUserId).select("-password");
		return res.status(200).json({ message: "User updated successfully", user });
	} catch (error: any) {
		console.log("Error in the updateUser controller", error.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
