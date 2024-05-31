import { Request, Response } from "express";

export const signup = async (_req: Request, res: Response) => {
	res.json({ data: "Signup" });
};

export const login = async (_req: Request, res: Response) => {
	res.json({ data: "login" });
};

export const logout = async (_req: Request, res: Response) => {
	res.json({ data: "logout" });
};
