import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "../config";
import jwt from "jsonwebtoken";

export const adminMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
	const header = req.headers.authorization; // 
	if (!header) {
		res.status(403).json({
			msg: "Unauthorized"
		});
		return;
	}
	const token = header.split(" ")[1]; // [Bearer, token]
	console.log(token);
	if(!token){
		res.status(403).json({
			msg: "Unauthorized"
		})
		return;
	}
	try{
		const decoded = await jwt.verify(token, JWT_PASSWORD) as jwt.JwtPayload;
		if(decoded.role === "Admin"){
			req.userId = decoded.id;
			next();
		}
	} catch(err){
		res.status(403).json({
			msg: "Unauthorized"
		})
	}
}