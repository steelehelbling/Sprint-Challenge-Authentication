const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

describe("test jokes ", () => {
  user = { username: "username", password: "password" };

  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("login status", () => {
    it("works when signed in", async () => {
      let token;
      await request(server)
        .post("/api/auth/register")
        .send(user)
        .then((res) => {
          token = res.body.token;
        });
      return await request(server)
        .get("/api/jokes")
        .set({ authorization: token })
        .then((res) => expect(res.status).toBe(200));
    });

    it("works when signed out", async () => {
      let token = 12;
      return await request(server)
        .get("/api/jokes")
        .set({ authorization: token })
        .then((res) => expect(res.status).toBe(401));
    });
  });
});
