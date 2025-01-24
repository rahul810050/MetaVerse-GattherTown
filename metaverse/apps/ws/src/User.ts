import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "@repo/db/client"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_PASSWORD } from "./config";
[]

function getRandomString(length: number){
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for(let i = 0; i < length; i++){
		result += characters[Math.floor(Math.random() * characters.length)];
	}
	return result;
}

export class User{
	public id: string
	public userId?: string
	private spaceId?: string;
	private x: number;
	private y: number;


	constructor(private ws: WebSocket){
		this.id = getRandomString(10);
		this.x = 0;
		this.y = 0;
	}

	initHandler(){
		this.ws.on("message", async (data)=> {
			const parsedData = JSON.parse(data.toString());
			switch (parsedData.type) {
				case "join": 
					const spaceId = parsedData.payload.spaceId;
					const token = parsedData.payload.token;
					const userId = (jwt.verify(token, JWT_PASSWORD) as JwtPayload).userId;
					if(!userId){
						this.ws.close();
						return;
					}
					this.userId = userId;
					const space = await client.space.findFirst({
						where: {
							id: spaceId
						}
					})

					if(!space){
						this.ws.close();
						return;
					}
					this.spaceId = spaceId
					RoomManager.getInstance().addUser(spaceId, this)
					this.x = Math.floor(Math.random()* space?.width!);
					this.y = Math.floor(Math.random() * space?.height!);
					this.send({
						type: "space-joined",
						payload: {
							spawn: {
								x: this.x,
								y: this.y
							},
							spaceId: spaceId,
							users: RoomManager.getInstance().rooms.get(spaceId)?.map((u)=> ({id: u.id})) ?? []
						}
					})

					RoomManager.getInstance().broadcast({
						type: "user-joined",
						payload: {
							userId: this.userId,
							x: this.x,
							y:  this.y	
						}
					}, this, this.spaceId!);
					break;

				case "move":
					const moveX = parsedData.payload.x;
					const moveY = parsedData.payload.y;
					const xDisplacement = Math.abs(this.x - moveX);
					const yDisplacement = Math.abs(this.y - moveY);
					// this is when the user moves vertically or horizontally
					if((xDisplacement == 1 && yDisplacement == 0) || (xDisplacement == 0 && yDisplacement == 1)){
						this.x = moveX;
						this.y = moveY;
						RoomManager.getInstance().broadcast({
							type: "move",
							payload: {
								x: this.x,
								y: this.y
							}
						}, this, this.spaceId!);
						return;
					}

					// this is when the user is trying to move diagonally then it got rejected
					this.send({
						type: "movement-rejected",
						payload: {
							x: this.x,
							y: this.y
						}
					});
			}
		})
	}

	destroy(){
		RoomManager.getInstance().broadcast({
			type: "user-left",
			payload: {
				userid: this.userId
			}
		}, this, this.spaceId!)
		RoomManager.getInstance().removeUser(this, this.spaceId!);
	}

	send(payload: OutgoingMessage){
		this.ws.send(JSON.stringify(payload));
	}
}