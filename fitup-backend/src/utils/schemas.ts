import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const createPlanSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  duration: z.number().int().positive(),
});

export const createEnrollmentSchema = z.object({
  userId: z.string().uuid(),
  planId: z.string().uuid(),
});

export const createWorkoutSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  studentId: z.string().uuid(),
  instructorId: z.string().uuid(), // <--- O CAMPO QUE FALTAVA
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number(),
    reps: z.number(),
    notes: z.string().optional()
  }))
});

export const createCheckInSchema = z.object({
  workoutId: z.string().uuid(),
  userId: z.string().uuid(), // <--- ADICIONADO TAMBÉM
});