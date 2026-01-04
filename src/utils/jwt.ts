import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";

interface TokenPayload {
  sub: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET || !JWT_EXPIRES_IN) {
  throw new Error("JWT environment variables are not defined");
}

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}
