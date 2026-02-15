import express from "express";
import prisma from "../prismaClient.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();


// 🔹 Dashboard (List Tasks)
router.get("/dashboard", requireAuth, async (req, res) => {
  const filter = req.query.filter || "all";

  let whereClause = {
    userId: req.userId
  };

  if (filter === "completed") {
    whereClause.completed = true;
  }

  if (filter === "pending") {
    whereClause.completed = false;
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" }
  });

  res.render("dashboard", { tasks, filter });
});


// 🔹 Create Task
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


// 🔹 Toggle Complete
router.post("/toggle/:id", requireAuth, async (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: req.userId
    }
  });

  if (!task) return res.redirect("/tasks/dashboard");

  await prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed }
  });

  res.redirect("/tasks/dashboard");
});


// 🔹 Edit Task
router.post("/edit/:id", requireAuth, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description } = req.body;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: req.userId
    }
  });

  if (!task) return res.redirect("/tasks/dashboard");

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description
    }
  });

  res.redirect("/tasks/dashboard");
});


// 🔹 Delete Task
router.post("/delete/:id", requireAuth, async (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: req.userId
    }
  });

  if (!task) return res.redirect("/tasks/dashboard");

  await prisma.task.delete({
    where: { id: taskId }
  });

  res.redirect("/tasks/dashboard");
});

export default router;
