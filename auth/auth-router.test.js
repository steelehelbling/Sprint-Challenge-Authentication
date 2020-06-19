const request = require("supertest");
const express = require("express");
const server = require("../api/server");
const db = require("../database/dbConfig");
const Users = require("../users-model");

describe("api/auth/", () => {
  const makeuser1 = { username: "steele", password: "helbling" };
  const makeuser2 = { username: "cole", password: "james" };

  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("register", () => {
    it("sends username Registration", async () => {
      return await request(server)
        .post("/api/auth/register")
        .send(makeuser1)
        .then((res) => {
          test = expect(res.body.created_user.username).toBe(
            makeuser1.username
          );
        });
    });

    it("sends post", async () => {
      return await request(server)
        .post("/api/auth/register")
        .send(makeuser1)
        .then((res) => expect(res.status).toBe(201));
    });
  });

  describe("Login", () => {
    it("sends username Login", async () => {
      await request(server).post("/api/auth/register").send(makeuser2);
      return await request(server)
        .post("/api/auth/login")
        .send(makeuser2)
        .then((res) => expect(res.body.username).toBe(makeuser2.username));
    });

    it("is working", async () => {
      await request(server).post("/api/auth/register").send(makeuser2);
      return await request(server)
        .post("/api/auth/login")
        .send(makeuser2)
        .then((res) => expect(res.status).toBe(200));
    });
  });
});
