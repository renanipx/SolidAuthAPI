import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";

interface TokenPayload {
  sub: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
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

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
}
