import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "../config";
import jwt, { JwtPayload }  from "jsonwebtoken";


export async function userAdminMiddleware(req: Request, res: Response, next: NextFunction){
	const header = req.headers.authorization;
	if(!header){
		res.status(403).json({
			msg: "Unauthorized"
		})
		return
	}

	try{
		const decoded = await jwt.verify(header, JWT_PASSWORD) as JwtPayload;

		if(decoded.role === "Admin" || decoded.role === "User"){
			req.userId = decoded.userId;
			return next()
		}
		res.status(403).json({
			msg: "Unauthorized"
		})
	} catch(error){
		res.status(403).json({
			msg: "Unauthorized"
		})
	}
}