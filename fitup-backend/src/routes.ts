import { Router } from "express";
import { AuthController } from "./controllers/AuthController";

const router = Router();
const authController = new AuthController();

// Rotas de Autenticação
router.post("/auth/register", authController.register); // [cite: 58]
router.post("/auth/login", authController.login); // [cite: 60]

export { router };
