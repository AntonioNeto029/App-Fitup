import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createEnrollmentSchema } from "../utils/schemas";
import { addMonths } from "date-fns";

export class EnrollmentController {
  async create(req: Request, res: Response) {
    const { userId, planId } = createEnrollmentSchema.parse(req.body);

    // Busca o plano para saber a duração
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: "Plano não encontrado" });

    // Calcula data de término
    const startDate = new Date();
    const endDate = addMonths(startDate, plan.duration);

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        planId,
        startDate,
        endDate,
        status: "ACTIVE",
      },
    });

    return res.status(201).json(enrollment);
  }
}