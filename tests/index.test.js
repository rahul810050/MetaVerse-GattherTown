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
    },
		{
			headers: {
				"authorization": `Bearer ${token}`
			}
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
      type: "user",
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

	test("admin has no space initially", async ()=> {
		const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,
			{
				headers: {
					"authorization": `Bearer ${adminToken}`
				}
			}
		);
		expect(response.data.spaces.length).toBe(0);
	})

	test("admin can create spaces as well", async()=> {
		const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/space/all`, {
			name: "test",
			dimensions: "100x200"
		},
		{
			headers: {
				"authorization": `Bearer ${adminToken}`
			}
		}
	)

	const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, 
		{
			headers: {
				"authorization": `Bearer ${adminToken}`
			}
		}
	);

	const filteredSpace = response.data.spaces.find((x)=> x.id === spaceCreateResponse.data.spaceId);

	expect(response.data.spaces.length).toBe(1);
	expect(filteredSpace).toBeDefined();
	})


});


describe("arena endpoints", ()=> {

	let mapId;
  let element1Id;
  let element2Id;
  let adminId;
  let adminToken;
	let userId;
	let userToken;
	let spaceId;

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
      type: "user",
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

		const space = await axios.post(`${BACKEND_URL}/api/v1/`, {
			name: "test",
			dimensions: "100x200",
			mapId: mapId
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		}
	)

	spaceId = space.data.id;
  });

	test("incorrect spaceid returns 400",async ()=> {
		const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kjshdfkhj`,
			{
				headers: {
					"authorization": `Bearer ${userToken}`
				}
			});
		expect(response.statusCode).toBe(400);
	})

	test("Correct spaceid returns all the elements",async ()=> {
		const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,
			{
				headers: {
					"authorization": `Bearer ${userToken}`
				}
			});
		expect(response.data.dimensions).toBe("100x200");
		expect(response.data.elements.length).toBe(3);
	})

	test("Delete endpoint is able to delete an element",async ()=> {
		const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,
			{
				headers: {
					"authorization": `Bearer ${userToken}`
				}
			});

		await axios.delete(`${BACKEND_URL}/api/v1/space/element`,{
			spaceId,
			elementId: response.data.elements[0].id
		})
		const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,
			{
				headers: {
					"authorization": `Bearer ${userToken}`
				}
			});
		expect(newResponse.data.elements.length).toBe(2);
	})

	test("adding an element works as expected",async ()=> {
		await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
			elementId: element1Id,
			spaceId,
			x: 50,
			y: 20
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		})

		const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,
			{
				headers: {
					"authorization": `Bearer ${userToken}`
				}
			})

		expect(response.data.elements.length).toBe(3);
	})

	test("adding an element fails if the element lies outside the dimension",async ()=> {
		const response = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
			elementId: element1Id,
			spaceId,
			x: 500000,
			y: 2097000
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		})

		expect(response.statusCode).toBe(404);
	})

	
})


describe("admin endpoints", ()=> {
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
      type: "user",
    });

    userId = userSignupRes.data.userId;

    const userSigninRes = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, {
      username,
      password,
    });

    userToken = userSigninRes.data.token;
  });

	test("user is not able to hit admin endpoints", async ()=> {
		const elementResponse = await axios.post(
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
          authorization: `Bearer ${userToken}`,
        },
      }
    );


		const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      thumbnail: "https://thumbnail.com/a.png",
      dimensions: "100x200",
      name: "100 person interview room",
      defaultElements: [],
    },{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		});

		const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
			imageURL: "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
			name: "tommy"
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		})
		const updatedElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
			imageURL: "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
		},
		{
			headers: {
				"authorization": `Bearer ${userToken}`
			}
		})

		expect(elementResponse.statusCode).toBe(403);
		expect(mapResponse.statusCode).toBe(403);
		expect(avatarResponse.statusCode).toBe(403);
		expect(updatedElementResponse.statusCode).toBe(403);


	})

	test("admin is able to hit admin endpoints", async ()=> {
		const elementResponse = await axios.post(
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


		const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      thumbnail: "https://thumbnail.com/a.png",
      dimensions: "100x200",
      name: "100 person interview room",
      defaultElements: [],
    },{
			headers: {
				"authorization": `Bearer ${adminToken}`
			}
		});

		const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
			imageURL: "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
			name: "tommy"
		},
		{
			headers: {
				"authorization": `Bearer ${adminToken}`
			}
		})
		
		expect(elementResponse.statusCode).toBe(200);
		expect(mapResponse.statusCode).toBe(200);
		expect(avatarResponse.statusCode).toBe(200);
		
	})

	test("admin is able to update the image of an element",async ()=> {

		const elementResponse = await axios.post(
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

		const updatedElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`, {
			imageURL: "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
		},
		{
			headers: {
				"authorization": `Bearer ${adminToken}`
			}
		})

		expect(updatedElementResponse.statusCode).toBe(200);
	})
})