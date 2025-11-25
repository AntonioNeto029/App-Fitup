// src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes";

// --- Importações Novas ---
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
// -------------------------

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- Rota da Documentação ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ----------------------------

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Docs available at http://localhost:${PORT}/api-docs`); // Log útil
});