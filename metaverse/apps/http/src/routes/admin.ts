import { Router } from "express";
import { createAvatarSchema, createElementSchema, createMapSchema, updateElementSchema } from "../types";
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
		console.log("element created")

		res.status(200).json({
			id: element.id
		})
	} catch(e){
		console.log("error while creating element",e)
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


// endpoint to create an avatar
adminRouter.post("/avatar", adminMiddleWare, async function(req, res){
	const parsedData = createAvatarSchema.safeParse(req.body);
	// console.log(parsedData.data);
	if(!parsedData.success){
		res.status(400).json({
			msg: "invalid credentials"
		})
		return
	}

	try{
		// console.log(req.userId);
		const avatar = await client.avatar.create({
			data: {
				imageUrl: parsedData.data.imageUrl,
				name: parsedData.data.name
			}
		})
		res.status(200).json({
			avatarId: avatar.id
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})


// endpoint to create a map
adminRouter.post("/map", adminMiddleWare,async function(req, res){
	const parsedData = createMapSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({
			msg: "invalid credentials"
		})
		return
	}

	try{
		const mapCreation = await client.map.create({
			data: {
				thumbnail: parsedData.data.thumbnail,
				name: parsedData.data.name,
				width: Number(parsedData.data.dimensions.split("x")[0]), 
				height: Number(parsedData.data.dimensions.split("x")[1]),
				mapElements: {
					create: parsedData.data.defaultElements.map(m=> ({
						elementId: m.elementId,
						x: m.x,
						y: m.y
					}))
				}
			}
		})
		console.log("map created")
		res.status(200).json({
			id: mapCreation.id
		})
	} catch(e){
		console.log("error while creating a map", e);
		res.status(400).json({
			error: (e as Error).message
		})
	}
})