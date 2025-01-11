const { default: axios } = require("axios");

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("user should be able to sign up once", async () => {
    const username = "concane";
    const password = "123456";
    const response = await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBeDefined();

    const againResponse = await axios.post(
      `${BACKEND_URL}/api/v1/users/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );

    expect(againResponse.statusCode).toBe(400);
  });

  test("signup fails if the username is empty", async () => {
    const username = "cocane";
    const password = "123456";
    const res = await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
      password,
      type: "admin",
    });
    expect(res.statusCode).toBe(400);
  });

  test("sign in succeeds if the username and password is correct", async () => {
    const username = `cocane${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
      username,
      password,
      type: "admin",
    });

    const res = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
      username,
      password,
      type: "admin",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("signin fails if the username and password are wrong", async () => {
    const username = `cocane${Math.random()}`;
    const password = `1234445${Math.random()}`;

    await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
      username,
      password,
      type: "admin",
    });

    const res = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
      username: "wrongUsername",
      password,
      type: "admin",
    });
    expect(res.statusCode).toBe(403);
  });
});

describe("user metadata endpoints", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `cocane${Math.random()}`;
    const password = "123456";

    await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
      username,
      password,
      type: "admin",
    });
    const res = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
      username,
      password,
    });

    const avatarRes = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      imageURL:
        "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
      name: "tommy",
    });

    avatarId = avatarRes.data.avatarId;
    token = res.data.token;
  });

  test("user cant update their metadata with wrong avatar id", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/users/metadata`,
      {
        avatarId: "878789345",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.statusCode).toBe(400);
  });

  test("user can update their metadata with right avatar id", async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/users/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    expect(res.statusCode).toBe(200);
  });

  test("user cant update their metadata if the auth headers is not present", async () => {
    const res = await axios.post(`${BACKEND_URL}/api/v1/users/metadata`, {
      avatarId,
    });
    expect(res.statusCode).toBe(403);
  });
});

describe("user avatar information", () => {
  let avatarId;
  let userId;
  let token;

  beforeAll(async () => {
    const username = `cocane${Math.random()}`;
    const password = "123456";

    const signupRes = await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
      username,
      password,
    });

    userId = signupRes.data.userId;

    const signinRes = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
      username,
      password,
      type: "admin",
    });

    token = signinRes.data.userId;

    const avatarRes = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      imageURL:
        "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
      name: "tommy",
    });

    avatarId = avatarRes.data.avatarId;
  });

  test("get back the avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBeDefined();
  });

  test("available avatar lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find((x) => x.id === avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminId;
  let adminToken;
	let userId;
	let userToken;

  beforeAll(async () => {
    const username = `cocane${Math.random()}`;
    const password = "123456";
		// admin 
    const signupRes = await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
      username,
      password,
      type: "admin",
    });

    adminId = signupRes.data.userId;

    const signinRes = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
      username,
      password,
    });

    adminToken = signinRes.data.token;

		// user

		const userSignupRes = await axios.post(`${BACKEND_URL}/api/v1/users/signup`, {
      username,
      password,
      type: "admin",
    });

    userId = userSignupRes.data.userId;

    const userSigninRes = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
      username,
      password,
    });

    userToken = userSigninRes.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageURL:
          "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      thumbnail: "https://thumbnail.com/a.png",
      dimensions: "100x200",
      name: "100 person interview room",
      defaultElements: [
        {
          elementId: element1Id,
          x: 20,
          y: 20,
        },
        {
          elementId: element2Id,
          x: 18,
          y: 20,
        },
        {
          elementId: element2Id,
          x: 19,
          y: 20,
        }
      ],
    },{
			headers: {
				"authorization": `Bearer ${adminToken}`
			}
		});

		mapId = map.id
  });

	test("user is able to create space", async ()=> {
		const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
			"name": "Test",
			"dimensions": "100x200",
			"mapId": mapId
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		}
	)
		expect(response.data.spaceId).toBeDefined();
	})

	test("user is able to create space without a mapId (empty space)", async ()=> {
		const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
			"name": "Test",
			"dimensions": "100x200"
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		}
	)
		expect(response.data.spaceId).toBeDefined();
	})

	test("user is not able to create space without a mapId and dimension (empty space)", async ()=> {
		const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
			"name": "Test"
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		}
	)
		expect(response.statusCode).toBe(400);
	})

	test("user is not able to delete a space that does not exist", async ()=> {
		const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
			"name": "Test"
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		}
	)
		expect(response.statusCode).toBe(400);
	})

	test("user is able to delete a space that does not exist", async ()=> {
		const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
			"name": "Test",
			"dimensions": "100x200"
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		}
	)

		const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
			"name": "Test"
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		}
	)
		expect(deleteResponse.statusCode).toBe(200);
	})

	test("user is not able to delete a space created by a different user", async ()=> {
		const differentUserToken = "kjhsdfgkjhsdfkjhaksdfjhgksjdfhg";

		const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
			"name": "Test",
			"dimensions": "100x200"
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		}
	)

	// user wont be able to delete the space which is created by the another user
		const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
			"name": "Test"
		},
		{
			headers: {
				"authorization": `Bearer ${differentUserToken}`
			}
		}
	)
		expect(deleteResponse.statusCode).toBe(403);
	})
});
