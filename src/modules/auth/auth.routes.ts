import { Router } from "express";
import { AuthController } from "./auth.controller";

const routes = Router();
const controller = new AuthController();

routes.post("/auth/login", (req, res) =>
  controller.login(req, res)
);

routes.post("/auth/refresh", (req, res) =>
  controller.refresh(req, res)
);

export { routes as authRoutes };
