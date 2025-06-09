"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
	try{
		const {userId} = await auth();
		const user = await currentUser();
		// console.log(user);
		
		if (!user) return;

		const existingUser = await prisma.user.findUnique({
			where:{
				clerkId: userId!
			}
		});
		if(existingUser) return existingUser;
		
		// const sendUserData = await axios.post("/api/v1/sign")
		const sendUserData = await prisma.user.create({
			data: {
				clerkId: userId!,
				username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
				password: "",
				email: user.emailAddresses[0].emailAddress,
				role: "User",
				avatarId: user.imageUrl!
			}
		})
		return sendUserData;
	} catch (error) {
		console.log(error);
	}
    
}