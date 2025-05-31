import {Router} from 'express';
import { userRouter } from './users';
import { adminRouter } from './admin';
import { spaceRouter } from './space';
import { signinSchema, signupSchema } from '../types';
import client from "@repo/db/client";
import jwt from 'jsonwebtoken';
import { hash, compare } from '../scrypt';
import { JWT_PASSWORD } from '../config';
import { userMiddleWare } from '../middlewares/userMiddleWare';
import { adminMiddleWare } from '../middlewares/adminMiddleWare';


export const router = Router();

router.post("/signup", async (req, res)=> {
	const parsedData = signupSchema.safeParse(req.body);
	if(!parsedData.success){
		res.status(400).json({error: parsedData.error.errors});
		return;
	}

	const userExistOrNot = await client.user.findUnique({
		where: {
			username: parsedData.data.username
		}
	})

	if(userExistOrNot){
		res.status(400).json({
			msg: "user already exist"
		})
		return
	}

	try{
		const hashedPassword = await hash(parsedData.data.password);
		const user = await client.user.create({
			data: {
				username: parsedData.data.username,
				password: hashedPassword,
				role: parsedData.data.type === "admin" ? "Admin" : "User",
			}
		})
		res.status(200).json({
			userId: user.id
		})
	} catch(err){
		res.status(400).json({
			error: (err as Error).message
		})
	}
})


router.post("/signin", async (req, res) => {
  const parsedData = signinSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(403).json({
      error: parsedData.error.errors,
      msg: "Invalid input data",
    });
    return;
  }

  try {
    // Check if user exists
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    // console.log("User from DB:", user); // Debugging

    if (!user) {
      res.status(403).json({
        msg: "User not found",
      });
      return;
    }

    const isValid = await compare(parsedData.data.password, user.password);

    if (!isValid) {
      res.status(403).json({
        msg: "Invalid password",
      });
      return;
    }
    console.log(user.role);

    // Generate JWT token
    // const jwtSecret = "secret"  ; // Fallback
		// console.log("jwtSecret", jwtSecret)
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_PASSWORD,
      { expiresIn: "1h" } // Token expiration time
    );
    // console.log(token);

    // Success response
    res.status(200).json({
      token
    });
  } catch (err) {
    // console.error("Error in Sign-In:", err); // Debugging
    res.status(403).json({
      error: (err as Error).message,
      msg: "An unexpected error occurred",
    });
  }
});


router.get("/elements", async (req, res)=> {
	try{
    const element = await client.element.findMany();
    res.status(200).json({
      elements: element.map(e => ({
        id: e.id,
        imageUrl: e.imageUrl,
        width: e.width,
        height: e.height,
        static: e.static
      }))
    })
  } catch(e){
    res.status(400).json({
      error: (e as Error).message
    })
  }
})


router.get("/avatars", async (req, res)=> {
	try{
    const avatar = await client.avatar.findMany();
    res.status(200).json({
      avatars: avatar.map(m=> ({
        id: m.id,
        imageUrl: m.imageUrl,
        name: m.name
      }))
    })
  } catch(e){
    res.status(400).json({
      error: (e as Error).message
    })
  }

})



router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/space", spaceRouter);