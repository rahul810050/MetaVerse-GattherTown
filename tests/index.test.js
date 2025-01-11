const { default: axios } = require("axios");

const BACKEND_URL = 	"http://localhost:3000";

describe("Authentication", ()=> {
	test("user should be able to sign up once", async ()=> {
		const username = "concane";
		const password = "123456";
		const response = await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
			username,
			password,
			type: "admin"
		})

		expect(response.statusCode).toBe(200);

		const againResponse = await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
			username,
			password,
			type: "admin"
		})

		expect(againResponse.statusCode).toBe(400);
	})

	test('signup fails if the username is empty', async ()=> {
		const username = "cocane";
		const password = "123456";
		const res = await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
			password,
			type: "admin"
		})
		expect(res.statusCode).toBe(400);
	})

	test("sign in succeeds if the username and password is correct", async ()=>{
		const username = `cocane${Math.random()}`;
		const password = "123456";

		await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
			username,
			password,
			type: "admin"
		})
		

		const res = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
			username,
			password,
			type: "admin"
		})
		expect(res.statusCode).toBe(200);
		expect(res.body.token).toBeDefined();
	})

	test("signin fails if the username and password are wrong", async ()=> {
		const username = `cocane${Math.random()}`;
		const password = `1234445${Math.random()}`;

		await axios.post(`${BACKEND_URL}/api/v1/users/signup` , {
			username,
			password,
			type: "admin"
		})

		const res = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
			username: "wrongUsername",
			password,
			type: "admin"
		})
		expect(res.statusCode).toBe(403);
	})
})


describe("user metadata endpoints", ()=> {
	let token = ""
	let avatarId = ""

	beforeAll( async()=> {
		const username =  `cocane${Math.random()}`
		const password = "123456";

		await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
			username,
			password,
			type: "admin"
		})
		const res = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
			username,
			password
		})

		const avatarRes = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
			imageURL: "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
			name: "tommy"
		})

		avatarId = avatarRes.data.avatarId;
		token = res.data.token;
	})

	test("user cant update their metadata with wrong avatar id", async ()=> {
		const res = await axios.post(`${BACKEND_URL}/api/v1/users/metadata`, {
			avatarId : "878789345",
		},
		{
			headers: {
				"authorization": `Bearer ${token}`
			}
		}
	)
		expect(res.statusCode).toBe(400);
	})

	test("user can update their metadata with right avatar id", async ()=> {
		const res = await axios.post(`${BACKEND_URL}/api/v1/users/metadata`, {
			avatarId
		},
		{
			headers: {
				"authorization": `Bearer ${token}`
			}
		}
	)
		expect(res.statusCode).toBe(200);
	})

	test("user cant update their metadata if the auth headers is not present", async ()=> {
		const res = await axios.post(`${BACKEND_URL}/api/v1/users/metadata`, {
			avatarId
		}
	)
		expect(res.statusCode).toBe(403);
	})

})


describe("", ()=> {
	
})