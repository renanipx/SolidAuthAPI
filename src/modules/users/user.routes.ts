import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";


const routes = Router();
const controller = new UserController();

routes.post("/users", (req, res) => controller.create(req, res));

routes.get(
  "/users/me",
  authMiddleware,
  roleMiddleware(["ADMIN", "USER"]),
  (req, res) => controller.me(req as any, res)
);

routes.get(
  "/users",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  (req, res) => controller.list(req, res)
);

routes.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  (req, res) => controller.delete(req, res)
);

export { routes as userRoutes };
