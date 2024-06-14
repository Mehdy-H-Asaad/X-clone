import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../lib/utils/generateToken";
import { REQUEST, RESPONSE } from "../types/expressTypes";

export const signup = async (req: REQUEST, res: RESPONSE) => {
	try {
		const { fullname, email, username, password } = req.body;

		if (!fullname || !email || !username || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: "Password must be at least 6 characters!" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			fullname,
			email,
			username,
			password: hashedPassword,
		});

		if (newUser) {
			generateTokenAndSetCookies(newUser._id.toString(), res);
			await newUser.save();
			return res.status(201).json({
				id: newUser._id,
				fullname: newUser.fullname,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			return res.status(400).json({ error: "Invalid user Data" });
		}
	} catch (error) {
		console.log(`Error in signup, check the signup controller : ${error}`);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const login = async (req: REQUEST, res: RESPONSE) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			user?.password || ""
		);

		if (!user || !isPasswordCorrect) {
			return res
				.status(400)
				.json({ error: "Username or Password are not valid" });
		}

		generateTokenAndSetCookies(user._id.toString(), res);

		return res.status(200).json({
			id: user._id,
			fullname: user.fullname,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});
	} catch (error) {
		console.log(`Error in Login, check the Login controller : ${error}`);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const logout = async (_req: REQUEST, res: RESPONSE) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log(`Error in Logout, check the Logout controller : ${error}`);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const getTheAuthUser = async (req: REQUEST, res: RESPONSE) => {
	try {
		const user = await User.findById((req as any).user._id);
		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in the getTheAuthUser controller", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
