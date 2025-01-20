import { Router } from "express";
import { updateMetadataSchema } from "../types";
import client from "@repo/db/client";

export const userRouter = Router();

userRouter.post("/metadata", async (req, res) => {
	const parsedData = updateMetadataSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(403).json({
			msg: "Bad Request"
		});
		return;
	}

	try{
		await client.user.update({
			where: {
				id: req.userId
			},
			data: {
				avatarId: parsedData.data.avatarId
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

userRouter.get("/metadata/bulk", async (req, res) => {
	const userIdString = (req.query.ids ?? "[]") as string;
	const userIds = (userIdString).slice(1, userIdString.length - 1).split(",");

	try{
		const metadata = await client.user.findMany({
			where: {
				id: {
					in: userIds
				}
			},
			select: {
				avatar: true,
				id: true,
			}
		})
		res.status(200).json({
			avatars: metadata.map(m => ({
				userId: m.id,
				avatarId: m.avatar?.imageUrl
			}))
		})
	} catch(e){
		res.status(403).json({
			error: (e as Error).message
		})
	}
});