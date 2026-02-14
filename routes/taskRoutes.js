import express from "express";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", requireAuth, async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId }
  });

  res.render("dashboard", { tasks });
});

// Create task
router.post("/create", requireAuth, async (req, res) => {
  const { title, description } = req.body;

  await prisma.task.create({
    data: {
      title,
      description,
      userId: req.userId
    }
  });

  res.redirect("/tasks/dashboard");
});

export default router;
