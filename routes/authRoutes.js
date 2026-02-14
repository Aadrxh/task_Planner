import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return res.send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  // Generate token immediately after signup
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,   // true in production
    sameSite: "lax"
  });

  res.redirect("/tasks/dashboard");
});

// Show login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.send("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.send("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });

  res.redirect("/tasks/dashboard");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

export default router;
