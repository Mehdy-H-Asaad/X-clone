import express from "express";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
import connectToMongo from "./db/connectToMongo";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	connectToMongo();
});
