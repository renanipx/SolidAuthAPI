import "express-async-errors";
import "dotenv/config";
import express from "express";
import { routes } from "../src/modules/routes";
import { errorHandler } from "./middlewares/error-handler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

export const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler); 
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

