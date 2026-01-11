import { NextFunction, Response } from "express";
import { AppError } from "../errors/app-error";
import { AuthRequest } from "./auth.middleware";

export function roleMiddleware(roles: Array<"ADMIN" | "USER">) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }

    return next();
  };
}