import { Router, Request, Response, json } from "express";
import { updateMetadataSchema } from "../types";
import client from "@repo/db/client";
import { adminMiddleWare } from "../middlewares/adminMiddleWare";
import { userMiddleWare } from "../middlewares/userMiddleWare";
import { string } from "zod";

export const userRouter = Router();
// endpoint to update the user metadata like avatarId
userRouter.post("/metadata", userMiddleWare, async (req, res) => {
	const parsedData = updateMetadataSchema.safeParse(req.body);
	// console.log(parsedData.data?.avatarId);
	if(!parsedData.success){
		res.status(403).json({
			msg: "Bad Request"
		});
		return;
	}
	const avatarId = parsedData.data.avatarId;
	// console.log(req.userId);

	try{
		const existAvatar = await client.avatar.findFirst({
			where: {
				id: avatarId
			}
		})
		if(!existAvatar){
			res.status(403).json({
				msg: "avatar does not exist"
			})
			return
		}
		await client.user.update({
			where: {
				id: req.userId
			},
			data: {
				avatarId
			}
		})
		res.status(200).json({
			msg: "Avatar updated"
		})
	} catch(err){
		res.status(403).json({
			error: (err as Error).message
		})
	}
});


// userRouter.get("/metadata/bulk", async (req, res) => {
// 	const userIdString = (req.query.ids ?? "[]") as string;
// 	const userIds = (userIdString).slice(1, userIdString.length - 1).split(",");

// 	try{
// 		const metadata = await client.user.findMany({
// 			where: {
// 				id: {
// 					in: userIds
// 				}
// 			},
// 			select: {
// 				avatar: true,
// 				id: true,
// 			}
// 		})
// 		res.status(200).json({
// 			avatars: metadata.map(m => ({
// 				userId: m.id,
// 				avatarId: m.avatar?.imageUrl
// 			}))
// 		})
// 	} catch(e){
// 		res.status(403).json({
// 			error: (e as Error).message
// 		})
// 	}
// });

// this is working fine....endpoint to the users with their avatar imageUrl
userRouter.get("/metadata/bulk", async function(req, res){
	try{
		const userIdString = req.query.ids as string | undefined;
		if(!userIdString){
			res.status(403).json({
				msg: "the ids are missing"
			})
			return
		}
		let userIds : string[];

		try{
			userIds = JSON.parse(userIdString);
			if(!Array.isArray(userIds)){
				throw new Error();
			}
		} catch{
			res.status(403).json({
				msg: "invalid id format it must be a json array"
			})
			return
		}

		const metadata = await client.user.findMany({
			where: {
				id: {
					in: userIds
				}
			},
			select: {
				id: true,
				avatar: {
					select: {
						imageUrl: true
					}
				}
			}
		})
		
		res.status(200).json({
			avatars: metadata.map((m)=> ({
				userId: m.id,
				avatarId: m.avatar?.imageUrl || null
			}))
		})
	} catch(error){
		// console.log("error while fetching the data from the database", error);
		res.status(403).json({
			error: (error as Error).message
		})
	}
})