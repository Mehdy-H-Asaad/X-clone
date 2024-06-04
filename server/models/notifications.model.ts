import mongoose from "mongoose";

const notificationsShcema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		reciver: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		type: {
			type: String,
			required: true,
			enum: ["like", "follow"],
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationsShcema);

export default Notification;
