import jwt from "jsonwebtoken";
import { RESPONSE } from "../../types/expressTypes";

export const generateTokenAndSetCookies = (userId: string, res: RESPONSE) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		httpOnly: true, // prevent XSS Attacks which prevents javascript code and allows only http
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development",
	});
};
