import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { registerSchema, loginSchema } from "../utils/schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ca } from "zod/locales";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);

      const usersExists = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (usersExists) {
        return res.status(409).json({ message: "Email já está em uso." });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role || "STUDENT",
        },
      });

      return res
        .status(201)
        .json({ message: "Usuário registrado com sucesso.", userId: user.id });
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ errors: error.errors });
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET não está definido no .env.");

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        secret,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      if (error.errors) return res.status(400).json(error.errors);
      return res.status(500).json({ error: "Erro ao fazer login" });
    }
  }
}
