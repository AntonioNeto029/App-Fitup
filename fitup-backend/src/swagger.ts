// src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FitUp API",
      version: "1.0.0",
      description: "API de gerenciamento de academia",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Arquivos onde o swagger vai procurar por anotações
  apis: ["./src/routes.ts"], 
};

export const swaggerSpec = swaggerJsdoc(options);