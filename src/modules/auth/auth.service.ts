import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { generateToken } from "../../utils/jwt";
import { RefreshTokenService } from "./refresh-token.service";
import { logger } from "../../lib/logger";

const refreshTokenService = new RefreshTokenService();
export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn("Login failed: user not found", { email });
      throw new AppError("Invalid credentials", 401);
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      logger.warn("Login failed: invalid password", {
        userId: user.id,
      });
      throw new AppError("Invalid credentials", 401);
    }

    logger.info("User logged in", {
      userId: user.id,
      role: user.role,
    });

    const accessToken = generateToken({
      sub: user.id,
      role: user.role,
    });

    const refreshToken = await refreshTokenService.create(user.id);

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const storedToken = await refreshTokenService.findValid(refreshToken);

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // invalida o token antigo (rotação)
    await refreshTokenService.delete(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const newAccessToken = generateToken({
      sub: user.id,
      role: user.role,
    });

    const newRefreshToken = await refreshTokenService.create(user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    };
  }
}
