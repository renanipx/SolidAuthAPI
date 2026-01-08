import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    return res.json(token);
  }
  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    const tokens = await authService.refresh(refreshToken);

    return res.json(tokens);
  }
}
