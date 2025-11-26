// src/controllers/PlanController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createPlanSchema } from "../utils/schemas";

export class PlanController {
  async create(req: Request, res: Response) {
    const data = createPlanSchema.parse(req.body);

    const plan = await prisma.plan.create({
      data,
    });

    return res.status(201).json(plan);
  }

  async list(req: Request, res: Response) {
    const plans = await prisma.plan.findMany();
    return res.json(plans);
  }
}