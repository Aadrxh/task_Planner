import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import prisma from "./prismaClient.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.redirect("/login");
});

function keepDatabaseAwake() {
  setInterval(async () => {
    try {
      await prisma.$executeRaw`SELECT 1`;
      console.log("[WAKEUP] Pinged DB successfully");
    } catch (e) {
      console.error("[WAKEUP] Ping failed:", e.message);
    }
  }, 240000); // every 4 minutes
}



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  // after app setup
  keepDatabaseAwake();
});
