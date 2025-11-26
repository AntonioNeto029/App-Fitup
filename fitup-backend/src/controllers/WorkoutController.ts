// src/controllers/WorkoutController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createWorkoutSchema } from "../utils/schemas";

export class WorkoutController {
  async create(req: Request, res: Response) {
    // Instrutor criando treino
    const instructorId = req.user.id;
    const { exercises, ...workoutData } = createWorkoutSchema.parse(req.body);

    const workout = await prisma.workout.create({
      data: {
        ...workoutData,
        instructorId,
        exercises: {
          create: exercises,
        },
      },
      include: { exercises: true },
    });

    return res.status(201).json(workout);
  }

  async listMyWorkouts(req: Request, res: Response) {
    // Aluno vendo seus treinos
    const workouts = await prisma.workout.findMany({
      where: { studentId: req.user.id },
      include: { exercises: true },
    });
    return res.json(workouts);
  }
}