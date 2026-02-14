import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
