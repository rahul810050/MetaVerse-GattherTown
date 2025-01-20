import { Router } from "express";
import { createElementSchema, updateElementSchema } from "../types";
import { adminMiddleWare } from "../middlewares/adminMiddleWare";
import client from '@repo/db/client'

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleWare, async function(req, res){
	const parsedData = createElementSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({
			msg: "invalid credentials to create an element"
		})
		return;
	}

	try{
		const element = await client.element.create({
			data: {
				imageUrl: parsedData.data.imageUrl,
				width: parsedData.data.width,
				height: parsedData.data.height,
				static: parsedData.data.static
			}
		})

		res.status(200).json({
			id: element.id
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})

// endpoint to update the element's imageUrl
adminRouter.put("/element/:elementId", adminMiddleWare, async function(req, res){
	const parsedData = updateElementSchema.safeParse(req.body);

	if(!parsedData.success){
		res.status(400).json({
			msg: "please give the imageUrl"
		})
		return
	}

	const elementGot = await client.element.findUnique({
		where: {
			id: req.params.elementId
		}
	})

	if(!elementGot){
		res.status(400).json({
			msg: "there is no element with this id"
		})
		return
	}

	try{
		const imageUpdate = await client.element.update({
			where: {
				id: elementGot.id
			},
			data: {
				imageUrl: parsedData.data.imageUrl
			}
		})
		res.status(200).json({
			msg: "element updated successfully"
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})
adminRouter.get("/avatar", async function(req, res){

})
adminRouter.post("/map", async function(req, res){

})