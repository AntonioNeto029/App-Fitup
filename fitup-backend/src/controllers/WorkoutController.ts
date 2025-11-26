import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createWorkoutSchema } from "../utils/schemas";

export class WorkoutController {
  
  // Criar Treino (Ficha)
  async create(req: Request, res: Response) {
    // Pegamos instructorId do corpo, pois removemos a autenticação
    const { exercises, instructorId, ...workoutData } = createWorkoutSchema.parse(req.body);

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

  // Listar treinos de um aluno específico
  async listByStudent(req: Request, res: Response) {
    const { studentId } = req.params; // O ID vem da URL (rota: /workouts/student/:studentId)
    
    const workouts = await prisma.workout.findMany({
      where: { studentId },
      include: { exercises: true },
    });
    return res.json(workouts);
  }

  // Deletar uma ficha de treino
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      // O "cascade" no schema.prisma deleta os exercícios automaticamente
      await prisma.workout.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar ficha." });
    }
  }
}