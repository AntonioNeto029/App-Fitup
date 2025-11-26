import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class UserController {
  async list(req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        cpf: true,
        enrollments: {
          select: {
            status: true,
            plan: { select: { name: true } },
          },
          where: { status: "ACTIVE" },
        },
      },
      orderBy: { name: "asc" },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Se tiver matrícula ativa, pega a primeira
      plan: user.enrollments[0]?.plan?.name || "Sem Plano",
      status: user.enrollments[0]?.status || "INATIVA",
    }));

    return res.json(formattedUsers);
  }
}
