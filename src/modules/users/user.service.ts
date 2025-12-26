import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

export class UserService {
  async create(data: { name: string; email: string; password: string }) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (emailExists) {
      throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
