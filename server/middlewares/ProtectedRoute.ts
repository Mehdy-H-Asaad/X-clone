import User from "../models/user.model";
import { NEXT, REQUEST, RESPONSE } from "../types/expressTypes";
import jwt, { JwtPayload } from "jsonwebtoken";
export const protectedRoute = async (
	req: REQUEST,
	res: RESPONSE,
	next: NEXT
) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Not Authorized, Token not found" });
		}

		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;

		if (!decodedToken) {
			return res
				.status(401)
				.json({ error: "Not Authorized, Token is not valid" });
		}

		const user = await User.findById(decodedToken.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		(req as any).user = user;
		next();
		return;
	} catch (error) {
		console.log("Error in the protectedroute middleware", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
