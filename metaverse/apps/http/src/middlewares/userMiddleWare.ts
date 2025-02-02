import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "../config";
import jwt  from "jsonwebtoken";


export const userMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
	const header = req.headers.authorization; // 
	if (!header) {
		res.status(403).json({
			msg: "Unauthorized"
		});
		return;
	}
	// console.log(header)
	// console.log(JWT_PASSWORD)
	// const token = header; // [Bearer, token]
	// const token = header.split(" ")[1]; // [Bearer, token]
	// console.log(token);
	// if(!token){
	// 	res.status(403).json({
	// 		msg: "Unauthorized"
	// 	})
	// 	return;
	// }
	try{
		const decoded = await jwt.verify(header, JWT_PASSWORD) as jwt.JwtPayload;
		// console.log(decoded.userId);
		if(decoded.role === "User"){
			req.userId = decoded.userId;
			next();
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