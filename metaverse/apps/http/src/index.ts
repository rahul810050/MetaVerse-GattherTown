import express from 'express';
import { router } from './routes';
import client from '@repo/db/client';

const app = express();

app.use(express.json());

// app.use((req, res, next) => {
// 	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
// 	console.log("Headers:", req.headers);
// 	console.log("Body:", req.body);
// 	console.log("Query Params:", req.query);
// 	next(); // Continue to the next middleware or route handler
// });

app.use("/api/v1/", router)

function main(){
	try{
		app.listen(3000, ()=> {
			console.log("Server is running on port 3000");
		})
	} catch(err){
		console.log("error while connecting to server", err);
	}
}
main();