import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "../config";
import jwt from "jsonwebtoken";

export const adminMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
	const header = req.headers.authorization; // header
	if (!header) {
		console.log("no token")
		res.status(403).json({
			msg: "Unauthorized"
		});
		return;
	}

	try{
		const decoded = await jwt.verify(header, JWT_PASSWORD) as jwt.JwtPayload;
		// console.log(decoded.userId);
		if(decoded.role === "Admin"){
			req.userId = decoded.userId;
			return next();
		}
		res.status(403).json({
			msg: "Unauthorized"
		})
	} catch(err){
		res.status(403).json({
			msg: "Unauthorized"
		})
	}
}