import { Router } from "express";
import { userRoutes } from "../modules/users/user.routes";

const routes = Router();

routes.use(userRoutes);

export { routes };
