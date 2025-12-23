import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/app-error";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export class UserService {
  async create(data: CreateUserDTO) {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new AppError("Email already in use", 409);
    }

    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
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
}
