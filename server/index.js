import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

//Imports Routes
import { connectDb } from "./src/database/mongodb.js";
import userRoutes from "./src/features/user/user.routes.js"
import taskRoutes from "./src/features/task/task.routes.js"

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // your React app
  credentials: true,               // allow cookies
}));

//Routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

//Test Routes
app.get("/", (req, res) => {
  res.send("Hello Task Manager");
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`Server is running on port ${process.env.PORT}`);
});
