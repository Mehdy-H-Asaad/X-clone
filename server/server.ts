import express from "express";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
import connectToMongo from "./db/connectToMongo";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
cloudinary.config({
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	connectToMongo();
});
