import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/app-error";
import { generateToken } from "../../utils/jwt";
import { RefreshTokenService } from "./refresh-token.service";

const refreshTokenService = new RefreshTokenService();
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
}
