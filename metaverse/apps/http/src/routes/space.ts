import { Router } from "express";
import { userMiddleWare } from "../middlewares/userMiddleWare";
import { adminMiddleWare } from "../middlewares/adminMiddleWare";
import { addElementSchema, createSpaceSchema, DeleteElementSchema } from "../types";
import client from "@repo/db/client";


export const spaceRouter = Router();

// endpoint to create a new space
spaceRouter.post("/", userMiddleWare || adminMiddleWare ,async (req, res)=> {
	const parsedData = createSpaceSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({error: parsedData.error.errors});
		return;
	}
	try{
		if(!parsedData.data.mapId){
			const space = await client.space.create({
				data: {
					name: parsedData.data.name,
					width: Number(parsedData.data.dimensions.split("x")[0]),
					height: Number(parsedData.data.dimensions.split("x")[1]),
					creatorId: req.userId || "",
				}
			})
			res.status(200).json({
				spaceId : space.id
			})
			return;
		}

		const map = await client.map.findUnique({
			where: {
				id: parsedData.data.mapId
			},
			select: {
				mapElements: true,
				width: true,
				height: true,
			}
		})
		if(!map){
			res.status(400).json({
				msg: "Map not found"
			})
			return;
		}

		// making a transaction so that if any of the operation fails, the whole operation is rolled back and nothing is saved and if succeed then both the operations will be created saved
		let space = await client.$transaction( async ()=> {
			const space = await client.space.create({
				data: {
					name: parsedData.data.name,
					width: map.width,
					height: map.height,
					creatorId: req.userId!,
				}
			});
			await client.spaceElement.createMany({
				data: map.mapElements.map(m=> ({
					spaceId: space.id,
					elementId: m.elementId,
					x: m.x!,
					y: m.y!,
				}))
			})
			return space
		})

		// sending the space id to the client
		res.status(200).json({
			spaceId: space.id
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})


// endpoint to get all spaces
spaceRouter.get("/all", userMiddleWare,async (req, res)=> {
	try{
		const allSpaces = await client.space.findMany({
			where: {
				creatorId: req.userId
			}
		})
		if(!allSpaces){
			res.status(400).json({
				msg: "no space found"
			})
			return;
		}

		res.status(200).json({
			spaces: allSpaces.map(s => ({
				id: s.id,
				name: s.name,
				dimensions: `${s.width}x${s.height}`,
				thumbnail: s.thumbnail
			}))
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})


// endpoint to delete a space
spaceRouter.delete("/:spaceId", userMiddleWare,async (req, res)=> {
	const spaceId = req.params.spaceId;
	try{
		const space = await client.space.findUnique({
			where: {
				id: spaceId
			},
			select: {
				creatorId: true
			}
		})

		if(!space){
			res.status(400).json({
				msg: "space not found"
			})
			return;
		}

		if(space.creatorId !== req.userId){
			res.status(401).json({
				msg: "You are not authorized to delete this space"
			})
			return;
		}
		await client.space.delete({
			where: {
				id: spaceId
			}
		})
		res.status(200).json({
			msg: "space deleted successfuly"
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})

// endpoint to add a new element in a space
spaceRouter.post("/element", userMiddleWare, async (req, res)=> {
	const parsedData = addElementSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({error: parsedData.error.errors});
		return;
	}

	try{
		const space = await client.space.findUnique({
			where: {
				id: parsedData.data.spaceId,
				creatorId: req.userId
			},
			select: {
				width: true,
				height: true
			}
		})
		if(!space){
			res.status(400).json({
				msg: "space not found"
			})
			return;
		}

		await client.spaceElement.create({
			data: {
				elementId: parsedData.data.elementId,
				spaceId: parsedData.data.spaceId,
				x: parsedData.data.x!,
				y: parsedData.data.y!
			}
		})
		res.status(200).json({
			msg: "element added successfully"
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})

// endpoint to delete an element from a space
spaceRouter.delete("/element", userMiddleWare,async (req, res)=> {
	const parsedData = DeleteElementSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({error: parsedData.error.errors});
		return;
	}
	try{
		const spaceElement = await client.spaceElement.findFirst({
			where: {
				id: parsedData.data.id,
			},
			include: {
				space: true
			}
		})

		if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId){
			res.status(400).json({
				msg: "unauthorized"
			})
			return;
		}

		await client.spaceElement.delete({
			where: {
				id: parsedData.data.id
			}
		})
		
		res.status(200).json({
			msg: "element deleted successfully"
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})


// endpoint to get a space by id
spaceRouter.get("/:spaceId", userMiddleWare, async (req, res)=> {
	try{
		const space = await client.space.findUnique({
			where: {
				id: req.params.spaceId
			},
			include: {
				elements: {
					include: {
						element: true
					}
				}
			}
		})

		if(!space){
			res.status(400).json({
				msg: "space not found"
			})
			return;
		}

		res.status(200).json({
			dimensions: `${space.width}x${space.height}`,
			elements: space.elements.map(e => ({
				id: e.id,
				element: {
					id: e.element.id,
					imageUrl: e.element.imageUrl,
					width: e.element.width,
					height: e.element.height,
					static: e.element.static
				},
				x: e.x,
				y: e.y
			})) 
		})
	} catch(e){
		res.status(400).json({
			error: (e as Error).message
		})
	}
})