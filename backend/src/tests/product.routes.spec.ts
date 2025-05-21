import request from "supertest";
import app from "../app";
import { sequelize, syncDatabase } from "../config/db";

describe("Product API", () => {
  let createdProductId: number;

  const sampleProduct = {
    title: "Producto Test",
    price: 100,
    description: "Descripción de prueba",
    category: "Electrónica",
    image: "https://example.com/image.jpg",
    ratingRate: 4.5,
    ratingCount: 10,
  };

  const updatedProduct = {
    title: "Producto Actualizado",
    price: 150,
    description: "Descripción actualizada",
    category: "Electrodomésticos",
    image: "https://example.com/image2.jpg",
    ratingRate: 4.8,
    ratingCount: 20,
  };

  beforeAll(async () => {
    await syncDatabase(true);
  });

  // CREATE
  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/product")
      .send(sampleProduct)
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(sampleProduct.title);
    createdProductId = res.body.id;
  });

  // GET ALL
  it("should return all products", async () => {
    const res = await request(app).get("/api/product").expect(200);

    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  // GET ONE
  it("should return one product by id", async () => {
    const res = await request(app)
      .get(`/api/product/${createdProductId}`)
      .expect(200);

    expect(res.body).toHaveProperty("id", createdProductId);
    expect(res.body.title).toBe(sampleProduct.title);
  });

  // UPDATE
  it("should update the product", async () => {
    const res = await request(app)
      .put(`/api/product/${createdProductId}`)
      .send(updatedProduct)
      .expect(200);

    expect(res.body).toHaveProperty("id", createdProductId);
    expect(res.body.title).toBe(updatedProduct.title);
  });

  // DELETE
  it("should delete the product", async () => {
    await request(app).delete(`/api/product/${createdProductId}`).expect(204);

    await request(app).get(`/api/product/${createdProductId}`).expect(404);
  });

  afterAll(async () => {
    await sequelize.close();
  });
});