import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { Prisma } from "@prisma/client";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return res.status(409).json({
          message: "Resource already exists",
        });

      case "P2025":
        return res.status(404).json({
          message: "Resource not found",
        });
    }
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}
