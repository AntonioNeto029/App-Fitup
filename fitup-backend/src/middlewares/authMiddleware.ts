// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // O formato é "Bearer <token>"
  const [, token] = authorization.split(" ");

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET não configurado");

    const decoded = jwt.verify(token, secret);
    const { id, role } = decoded as TokenPayload;

    req.user = { id, role };

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// Middleware para verificar permissões (Roles)
export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso negado: permissão insuficiente." });
    }
    return next();
  };
}