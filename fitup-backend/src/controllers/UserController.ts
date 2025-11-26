import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export class UserController {
  // 1. Criar Usuário
  async create(req: Request, res: Response) {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().optional(), // Opcional se for aluno criado pela recepção
      role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
    });

    try {
      const data = schema.parse(req.body);
      
      // Verifica se já existe
      const userExists = await prisma.user.findUnique({ where: { email: data.email } });
      if (userExists) {
        return res.status(409).json({ error: "Email já cadastrado." });
      }

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password || "123456", // Senha padrão se não vier
          role: data.role || "STUDENT",
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: "Dados inválidos." });
    }
  }

  // 2. Listar todos os usuários
  async list(req: Request, res: Response) {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    });
    return res.json(users);
  }

  // 3. Buscar um único usuário (Show)
  async show(req: Request, res: Response) {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    
    return res.json(user);
  }

  // 4. Atualizar usuário
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateSchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
    });

    try {
      const data = updateSchema.parse(req.body);
      const user = await prisma.user.update({
        where: { id },
        data,
      });
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar usuário" });
    }
  }

  // 5. Deletar usuário
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.user.delete({ where: { id } });
      return res.status(204).send(); // 204 = Sucesso sem conteúdo
    } catch (error) {
      // Erro comum: tentar deletar usuário que tem relacionamentos (fichas, matrículas)
      // O Prisma pode barrar se não estiver configurado Cascade Delete no banco,
      // ou se quisermos proteger os dados históricos.
      console.error(error);
      return res.status(400).json({ error: "Erro ao deletar (verifique se o usuário tem matrículas ou treinos)" });
    }
  }
}