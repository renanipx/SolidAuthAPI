import { prisma } from "../../lib/prisma";
import crypto from "crypto";

export class RefreshTokenService {
  async create(userId: string) {
    const token = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS)
    );

    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findValid(token: string) {
    return prisma.refreshToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async delete(token: string) {
    return prisma.refreshToken.delete({
      where: { token },
    });
  }
}
