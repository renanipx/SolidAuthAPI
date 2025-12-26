import bcrypt from "bcryptjs";
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
