import Notification from "../models/notifications.model";
import { REQUEST, RESPONSE } from "../types/expressTypes";

export const getNotifications = async (req: REQUEST, res: RESPONSE) => {
	try {
		const reqUserId = (req as any).user._id;

		const notifications = await Notification.find({
			reciver: reqUserId,
		}).populate({
			path: "sender",
			select: "profileImg username",
		});

		await Notification.updateMany({ reciver: reqUserId }, { read: true });

		return res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in the getNotifications controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteNotifications = async (req: REQUEST, res: RESPONSE) => {
	try {
		const reqUserId = (req as any).user._id;

		await Notification.deleteMany({ reciver: reqUserId });

		return res
			.status(200)
			.json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in the getNotifications controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
