import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { logger } from "../../lib/logger";

interface ListUsersParams {
  page: number;
  limit: number;
  role?: Role;
  email?: string;
}

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

    const user = await prisma.user.create({
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

    logger.info("User created", {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return user;
  };

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

  async list({ page, limit, role, email }: ListUsersParams) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (email) {
      where.email = {
        contains: email,
        mode: "insensitive",
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      meta: {
        total,
        totalPages,
        page,
        limit,
      },
    };
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
