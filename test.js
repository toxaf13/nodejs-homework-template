const request = require("supertest");
const app = require("./app");

describe("test login", () => {
  test("should response with the POST method", async () => {
     return request(app)
        .post("/api/users/login")
        .send({
           email: "email",
           password: "password",
        })
        .expect(200);
  });
});