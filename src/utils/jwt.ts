import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/app-error";

interface TokenPayload {
  sub: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

const signOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
};

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, signOptions);
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}
