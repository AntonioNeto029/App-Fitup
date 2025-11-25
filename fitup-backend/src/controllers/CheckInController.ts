// src/controllers/CheckInController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { startOfDay, endOfDay } from "date-fns";
import { z } from "zod";

export class CheckInController {
  async create(req: Request, res: Response) {
    const userId = req.user.id;
    const { workoutId } = z.object({ workoutId: z.string().uuid() }).parse(req.body);

    // 1. Validar matrícula ativa
    const activeEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        endDate: { gte: new Date() } // Data de fim maior que hoje
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
      return res.status(400).json({ error: "Você já fez check-in hoje!" });
    }

    const checkIn = await prisma.checkIn.create({
      data: { userId, workoutId },
    });

    return res.status(201).json(checkIn);
  }

  async history(req: Request, res: Response) {
    const checkIns = await prisma.checkIn.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { workout: { select: { name: true } } }
    });
    return res.json(checkIns);
  }
}