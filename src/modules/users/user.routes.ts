import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const routes = Router();
const controller = new UserController();

routes.post("/users", (req, res) => controller.create(req, res));

routes.get(
  "/users/me",
  authMiddleware,
  (req, res) => controller.me(req as any, res)
);

export { routes as userRoutes };
