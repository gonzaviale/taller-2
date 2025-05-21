import request from "supertest";
import app from "../app";
import { sequelize, syncDatabase } from "../config/db";

describe("User API", () => {
  let createdUserId: string;

  const sampleUser = {
    username: "johndoe",
    email: "john@example.com",
    password: "secret123",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St",
  };

  const updatedUser = {
    username: "johnnydoe",
    email: "johnny@example.com",
    firstName: "Johnny",
    lastName: "Doe",
    address: "456 Elm St",
  };

  beforeAll(async () => {
    await syncDatabase(true);
  });

  // CREATE
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/user")
      .send(sampleUser)
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.username).toBe(sampleUser.username);
    createdUserId = res.body.id;
  });

  // GET ALL
  it("should return all users", async () => {
    const res = await request(app).get("/api/user").expect(200);

    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThan(0);
  });

  // GET ONE
  it("should return one user by id", async () => {
    const res = await request(app)
      .get(`/api/user/${createdUserId}`)
      .expect(200);

    expect(res.body).toHaveProperty("id", createdUserId);
    expect(res.body.username).toBe(sampleUser.username);
  });

  // UPDATE
  it("should update the user", async () => {
    const res = await request(app)
      .put(`/api/user/${createdUserId}`)
      .send(updatedUser)
      .expect(200);

    expect(res.body).toHaveProperty("id", createdUserId);
    expect(res.body.username).toBe(updatedUser.username);
  });

  // DELETE
  it("should delete the user", async () => {
    await request(app).delete(`/api/user/${createdUserId}`).expect(204);

    await request(app).get(`/api/user/${createdUserId}`).expect(404);
  });

  // Cerrar la conexión a la base de datos después de todas las pruebas
  afterAll(async () => {
    await sequelize.close();
  });
});
