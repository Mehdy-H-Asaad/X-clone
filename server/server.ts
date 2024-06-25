import express from "express";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import postroutes from "./routes/post.route";
import notificationRoutes from "./routes/notifications.route";
import dotenv from "dotenv";
import connectToMongo from "./db/connectToMongo";
import cookieParser from "cookie-parser";

import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { REQUEST, RESPONSE } from "./types/expressTypes";

dotenv.config();

cloudinary.config({
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postroutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV == "production") {
	app.use(express.static(path.join(path.resolve(), "client/dist")));

	app.get("*", (_req: REQUEST, res: RESPONSE) => {
		res.sendFile(path.resolve(path.resolve(), "client/dist/index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	connectToMongo();
});
