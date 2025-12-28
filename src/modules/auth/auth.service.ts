import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return {
      accessToken: token,
    };
  }
}
