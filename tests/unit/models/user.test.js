const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthtoken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      // i add toHexString because generateAuthtoken() coverts my id from string to  hex string
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    //also add a config file for test
    expect(decoded).toMatchObject(payload);
  });
});

// it is sometimes necessary to use external dependencies, such as libraries or modules, to test a function or method, especially when it relies on those external dependencies to function correctly.