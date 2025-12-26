import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "./auth/auth.routes";

const routes = Router();

routes.use(userRoutes);
routes.use(authRoutes);

export { routes };
