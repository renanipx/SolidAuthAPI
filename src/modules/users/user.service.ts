import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
export class UserService {
  async create(data: {
    name: string;
    email: string;
    password: string;
  }) {
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
        role: Role.USER,
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

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async list() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string) {
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new AppError("User not found", 404);
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}
