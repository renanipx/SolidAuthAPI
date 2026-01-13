import { Router } from "express";
import { AuthController } from "./auth.controller";
import {
  loginRateLimiter,
  refreshRateLimiter,
} from "../../middlewares/rate-limit.middleware";

const routes = Router();
const controller = new AuthController();

routes.post(
  "/auth/login",
  loginRateLimiter,
  (req, res) => controller.login(req, res)
);

routes.post(
  "/auth/refresh",
  refreshRateLimiter,
  (req, res) => controller.refresh(req, res)
);

export { routes as authRoutes };
