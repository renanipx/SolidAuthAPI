import { Request, Response } from "express";
import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user = await userService.create({
      name,
      email,
      password,
    });

    return res.status(201).json(user);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userService.findById(id);

    return res.json(user);
  }
}
