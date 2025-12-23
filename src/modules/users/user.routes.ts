import { Router } from "express";
import { UserController } from "./user.controller";

const routes = Router();
const controller = new UserController();

routes.post("/users", (req, res) => controller.create(req, res));
routes.get("/users/:id", (req, res) => controller.findById(req, res));

export { routes as userRoutes };
