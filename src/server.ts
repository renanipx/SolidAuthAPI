import "dotenv/config";
import express from "express";
import { prisma } from "./lib/prisma";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API running 🚀");
});

app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
