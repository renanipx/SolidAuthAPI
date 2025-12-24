import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { prisma } from "../lib/prisma";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export async function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const userId = req.headers["x-user-id"];

  if (!userId || typeof userId !== "string") {
    throw new AppError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  req.user = user;

  next();
}
