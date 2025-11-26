import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { startOfDay, endOfDay } from "date-fns";
import { createCheckInSchema } from "../utils/schemas";

export class CheckInController {
  async create(req: Request, res: Response) {
    // Pegamos userId do corpo
    const { workoutId, userId } = createCheckInSchema.parse(req.body);

    // 1. Validar matrícula ativa
    const activeEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        endDate: { gte: new Date() }
      }
    });

    if (!activeEnrollment) {
      return res.status(403).json({ error: "Matrícula inativa ou vencida." });
    }

    // 2. Validar check-in duplicado no dia
    const today = new Date();
    const checkInExists = await prisma.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    if (checkInExists) {
      return res.status(400).json({ error: "Aluno já fez check-in hoje!" });
    }

    const checkIn = await prisma.checkIn.create({
      data: { userId, workoutId },
    });

    return res.status(201).json(checkIn);
  }

  async history(req: Request, res: Response) {
    const { userId } = req.params; // ID pela URL
    const checkIns = await prisma.checkIn.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { workout: { select: { name: true } } }
    });
    return res.json(checkIns);
  }
}