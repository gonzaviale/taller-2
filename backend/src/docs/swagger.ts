import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Taller 2 API",
      version: "1.0.0",
      description: "API documentation for Taller 2",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        UserRequestDTO: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            address: { type: "string" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserResponseDTO: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            email: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            address: { type: "string" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProductDTO: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            price: { type: "number" },
            description: { type: "string" },
            category: { type: "string" },
            image: { type: "string" },
            ratingRate: { type: "number" },
            ratingCount: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PurchaseCreateDTO: {
          type: "object",
          properties: {
            userId: { type: "integer" },
            productIds: {
              type: "array",
              items: { type: "integer" },
            },
          },
        },
        PurchaseResponseDTO: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            total: { type: "number" },
            status: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
