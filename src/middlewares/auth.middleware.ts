import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { verifyToken } from "../utils/jwt";

export type UserRole = "ADMIN" | "USER";
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Unauthorized", 401);
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}
