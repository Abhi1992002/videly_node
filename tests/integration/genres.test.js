let server;
const { default: mongoose } = require("mongoose");
const request = require("supertest"); //with request we can send request to an endpoint
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user"); //i want auth token from it

//if you make change , jest rerun test => so we load the server again , we got an exception because there is a server running on port 3000

//so we need to load the server before and close it after each function

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  //Always remember change the node env to test before testing otherwise we use production database for testing
  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres ", async () => {
      //populating the test db

      //now whwn this test run we add 3 genres evertime which cause error ,so we clean our database after every test
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ]);

      //http request testing
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);

      expect(res.body.length).toBe(3);

      //array.some() => to check if some object have this name property ot not
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    // validating the object ids
    it("should return 404 if invalid id is passed", async () => {
      // we paas an invalid id as 1
      // i have no genre in database because i am ginving wrong id , so it does not match any genre so no matter to add a new genre
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });
    it("should return 404 if no genre with given id is not present", async () => {
      const id = new mongoose.Types.ObjectId()
      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {

    //we only make variable of those who are not similar in all test 
    let token;
    let name; 

   const exec = async()=>{
    return   await request(server)
             .post("/api/genres")
             .set('x-auth-token', token)
             .send({ name });
   }

 
   beforeEach(()=>{
    token = new User().generateAuthToken();  
    name = 'genre1'  
})


    //auth test
    it("should run 401 if client is not logged in", async() => {
    
    // he doesnot need token
    token = ''
    const res = await exec()

    expect(res.status).toBe(401);

    });

    //Testing the invalid inputs 
    it("should run 400 if genre is less than 5 charater", async() => {

    name = '1234'

    const res =  await exec()

    expect(res.status).toBe(400);

    });

    it("should run 400 if genre is more than 50 charater", async() => {
    
    name = new Array(52).join('a')

    const res = await exec()
    
    expect(res.status).toBe(400);

    });
    it("should save the genre if it is valid", async() => {


          const res = await exec()

        const genre =  Genre.findById({name: 'genre1'})   
         
         expect(genre).not.toBeNull()
     
         });

    it("should return the genre if it is valid", async() => {

        const res = await exec() 

         expect(res.body).toHaveProperty('_id')
         expect(res.body).toHaveProperty('name','genre1')

     
         });

  });


});
