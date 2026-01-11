import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
  async create(req: any, res: Response) {
    const user = await userService.create(req.body);
    return res.status(201).json(user);
  }

  async me(req: AuthRequest, res: Response) {
    const user = await userService.findById(req.user!.id);
    return res.json(user);
  }

  async list(req: any, res: Response) {
    const users = await userService.list();
    return res.json(users);
  }

  async delete(req: any, res: Response) {
    const { id } = req.params;

    await userService.delete(id);

    return res.status(204).send();
  }
}
