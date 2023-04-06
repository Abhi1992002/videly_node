let server;
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("auth middleware", () => {

  beforeEach(() => {
    server = require("../../index.js");
  });

  afterEach(async() => {
    await server.close();
    await Genre.deleteMany({})
  });



let token;
let name; 

const testing = async()=>{
return   await request(server)
         .post("/api/genres")
         .set('x-auth-token', token)
         .send({ name });
}


beforeEach(()=>{
token = new User().generateAuthToken();  
name = 'genre1'  
})

it("should run 401 if token is not there", async() => {
    
    // he doesnot need token
    token = ''
    const res = await testing()

    expect(res.status).toBe(401);

    });

it("should run 400 if client is incorrect", async() => {
    
    // he doesnot need token
    token = 'a'
    const res = await testing()

    expect(res.status).toBe(400);

    });

it("should run 200 if client is incorrect", async() => {
    
    // he doesnot need token
    const res = await testing()

    expect(res.status).toBe(200);

    });
});
