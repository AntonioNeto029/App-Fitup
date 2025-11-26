import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createPlanSchema } from "../utils/schemas";
import { z } from "zod";

export class PlanController {
  // 1. Criar Plano (Método que estava faltando)
  async create(req: Request, res: Response) {
    const data = createPlanSchema.parse(req.body);

    const plan = await prisma.plan.create({
      data,
    });

    return res.status(201).json(plan);
  }

  // 2. Listar Planos (Método que estava faltando)
  async list(req: Request, res: Response) {
    const plans = await prisma.plan.findMany();
    return res.json(plans);
  }

  // 3. Atualizar Plano
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const schema = z.object({
      name: z.string().optional(),
      price: z.number().optional(),
      duration: z.number().int().optional(),
    });

    try {
      const data = schema.parse(req.body);
      const plan = await prisma.plan.update({
        where: { id },
        data,
      });
      return res.json(plan);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar plano" });
    }
  }

  // 4. Deletar Plano
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.plan.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: "Não é possível deletar plano com alunos matriculados." });
    }
  }
}