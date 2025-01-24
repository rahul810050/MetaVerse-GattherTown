const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:8080";

// Axios Wrapper for Simplified Requests
const axios = {
  post: async (url, data) => {
    try {
      const res = await axios2.post(url, data);
      return res;
    } catch (error) {
      return error.response || { status: 500, data: { error: "Unknown Error" } };
    }
  },
  put: async (url, data) => {
    try {
      const res = await axios2.put(url, data);
      return res;
    } catch (error) {
      return error.response || { status: 500, data: { error: "Unknown Error" } };
    }
  },
  delete: async (url) => {
    try {
      const res = await axios2.delete(url);
      return res;
    } catch (error) {
      return error.response || { status: 500, data: { error: "Unknown Error" } };
    }
  },
  get: async (url) => {
    try {
      const res = await axios2.get(url);
      return res;
    } catch (error) {
      return error.response || { status: 500, data: { error: "Unknown Error" } };
    }
  },
};

// Test Suite
// describe("Authentication API Tests", () => {
//   test("User should be able to sign up once", async () => {
//     const username = `concane${Math.random().toString(36).substring(7)}`;
//     const password = "123456";

//     // First Signup Attempt
//     const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });

//     expect(response.status).toBe(200);
//     expect(response.data.userId).toBeDefined();

//     // Duplicate Signup Attempt
//     const againResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });

//     expect(againResponse.status).toBe(400);
//     expect(againResponse.data.msg).toBe("user already exist");
//   });

//   test("Signup fails if the username is empty", async () => {
//     const password = "123456";

//     const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       password,
//       type: "admin",
//     });

//     expect(response.status).toBe(400);
//     expect(response.data.error).toBeDefined(); // Validation error
//   });

//   test("Sign in succeeds with correct username and password", async () => {
//     const username = `rahul${Math.random().toString(36).substring(7)}`;
//     const password = "123456";
  
//     try {
//       // Step 1: Sign Up First
//       const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//         username,
//         password,
//         type: "admin",
//       });
      
  
//       expect(signupResponse.status).toBe(200);
//       expect(signupResponse.data.userId).toBeDefined(); // Validate user ID is returned
  
//       // Step 2: Sign In with Correct Credentials
//       const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//         username,
//         password,
//       });
  
//       console.log(signinResponse.data)
//       expect(signinResponse.status).toBe(200);
//       expect(signinResponse.data.token).toBeDefined(); // Validate token is returned
//     } catch (error) {
//       console.log("Test failed:", error.response?.data || error.message);
//       throw error; // Ensure test fails if an error occurs
//     }
//   });
  

//   test("Sign in fails with incorrect username or password", async () => {
//     const username = `rahul${Math.random().toString(36).substring(7)}`;
//     const password = "123456";

//     // Sign Up First
//     await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });

//     // Sign In with Incorrect Username
//     const wrongUsernameResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username: "wrongUsername",
//       password,
//     });

//     expect(wrongUsernameResponse.status).toBe(403);
//     expect(wrongUsernameResponse.data.msg).toBe("User not found");

//     // Sign In with Incorrect Password
//     const wrongPasswordResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password: "wrongPassword",
//     });

//     expect(wrongPasswordResponse.status).toBe(403);
//     expect(wrongPasswordResponse.data.msg).toBe("Invalid password");
//   });

// });


describe("user metadata endpoints", () => {
  let token ;
  let avatarId ;

  beforeAll(async () => {
    const username = `concane${Math.random().toString(36).substring(7)}`;
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
      imageUrl:
        "https://img.freepik.com/premium-psd/3d-render-avatar-character_23-2150611743.jpg?ga=GA1.1.1201487365.1736583224&semt=ais_hybrid",
      name: `tommy${Math.random()}`,
    },
    {
      headers: {
        authorization: `Bearer ${res.data.token}`
      }
    }
  );

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
    expect(res.status).toBe(403);
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
    console.log(res.data);
    expect(res.status).toBe(200);
  });

  test("user cant update their metadata if the auth headers is not present", async () => {
    const res = await axios.post(`${BACKEND_URL}/api/v1/users/metadata`, {
      avatarId,
    });
    expect(res.status).toBe(403);
  });
});


describe("user avatar information", () => {
  let avatarId;
  let userId;
  let token;

  beforeAll(async () => {
    const username = `rahul${Math.random()}`;
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
    const username = `rahul${Math.random()}`;
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
		expect(response.status).toBe(400);
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
		expect(response.status).toBe(400);
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
		expect(deleteResponse.status).toBe(200);
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
		expect(deleteResponse.status).toBe(403);
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
    const username = `rahul${Math.random()}`;
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
		expect(response.status).toBe(400);
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

		expect(response.status).toBe(404);
	})

	
})


describe("admin endpoints", ()=> {
  let adminId;
  let adminToken;
	let userId;
	let userToken;

	beforeAll(async () => {
    const username = `rahul${Math.random()}`;
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

		expect(elementResponse.status).toBe(403);
		expect(mapResponse.status).toBe(403);
		expect(avatarResponse.status).toBe(403);
		expect(updatedElementResponse.status).toBe(403);


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
		
		expect(elementResponse.status).toBe(200);
		expect(mapResponse.status).toBe(200);
		expect(avatarResponse.status).toBe(200);
		
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

		expect(updatedElementResponse.status).toBe(200);
	})
})



describe("websocket tests", ()=> {
  let adminId;
  let adminToken;
  let userId;
  let userToken;
  let mapId;
  let element1Id;
  let element2Id;
  let spaceId;
  let ws1;
  let ws2;
  let ws1Message = [];
  let ws2Message = [];
  let userX;
  let userY;
  let adminX;
  let adminY;


  function waitForAndPopLatestMessage(messageeArray){
    return new Promise((resolve, reject)=> {
      if(messageeArray.length > 0){
        resolve(messageeArray.shift())
      } else{
        let interval = setInterval(() => {
          if(messageeArray.length > 0){
            resolve(messageeArray.shift());
            clearTimeout(interval)
          }
        }, 100);
      }
    })
  }

  async function setupHTTP(){
    const username = "rahul" + Math.random();
    const password = "123456"

    // admin
    const adminSignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    })

    const adminSigninRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password
    })

    adminId = adminSignupRes.data.userId;
    adminToken = adminSigninRes.data.token;

    // user
    const userSignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "-user",
      password,
      type: "user"
    })

    const userSigninRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password
    })

    userId = userSignupRes.data.userId;
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
  }

  async function setupWS(){
    ws1 = new WebSocket(WS_URL);
    
    await new Promise(r => {
      ws1.onopen = r;
    })
    ws1.onmessage = (event)=> {
      ws1Message.push(JSON.stringify(event.data));
    }
    
    ws2 = new WebSocket(WS_URL);

    await new Promise(r => {
      ws2.onopen = r;
    })


    ws2.onmessage = (event)=> {
      ws2Message.push(JSON.stringify(event.data));
    }

    

  }

  beforeAll(async ()=> {
    await setupHTTP()
    await setupWS()
  })

  test("get back acknowledgement for joining the space", async ()=> {
    ws1.send(JSON.stringify({
      "type": "join",
      "payload": {
        "spaceId": spaceId,
        "token": adminToken
      }
    }))
    
    const message1 = await waitForAndPopLatestMessage(ws1Message)

    ws2.send(JSON.stringify({
      "type": "join",
      "payload": {
        "spaceId": spaceId,
        "token": userToken
      }
    }))

    const message2 = await waitForAndPopLatestMessage(ws2Message)
    const message3 = await waitForAndPopLatestMessage(ws1Message)

    expect(message1.type).toBe("space-joined")
    expect(message2.type).toBe("space-joined")

    expect(message1.payload.users.length).toBe(0);
    expect(message2.payload.users.length).toBe(1);
    expect(message3.type).toBe("user-join");
    expect(message3.payload.x).toBe(message2.payload.spawn.x);
    expect(message3.payload.y).toBe(message2.payload.spawn.x);

    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spawn.y;
    userX = message2.payload.spawn.x;
    userY = message2.payload.spawn.y;
  })

  test("user is not able to move across the wall", async ()=> {
    ws1.send(JSON.stringify({
      type: "move",
      payload: {
        x: 100000,
        y: 100000
      }
    }))
    const message = await waitForAndPopLatestMessage(ws1Message);
    expect(message.type).toBe("movement-rejected")
    expect(message.payload.x).toBe(adminX)
    expect(message.payload.y).toBe(adminY)
  })

  
  test("user is not able to move two blocks at the same time", async ()=> {
    ws1.send(JSON.stringify({
      type: "move",
      payload: {
        x: adminX + 2,
        y: adminY
      }
    }))
    const message = await waitForAndPopLatestMessage(ws1Message);
    expect(message.type).toBe("movement-rejected")
    expect(message.payload.x).toBe(adminX)
    expect(message.payload.y).toBe(adminY)
  })

  test("correct moovement should be broadcasted to the other sockets in the same room", async ()=> {
    ws1.send(JSON.stringify({
      type: "move",
      payload: {
        x: adminX + 1,
        y: adminY,
        userId: adminId
      }
    }))
    const message = await waitForAndPopLatestMessage(ws2Message);
    expect(message.type).toBe("movement")
    expect(message.payload.x).toBe(adminX + 1)
    expect(message.payload.y).toBe(adminY)
  })
  
  test("if a user leaves then the other users get a leave event", async ()=> {
    ws1.close()
    const message = await waitForAndPopLatestMessage(ws2Message);
    expect(message.type).toBe("user-left")
    expect(message.payload.userId).toBe(adminId);
  })

})