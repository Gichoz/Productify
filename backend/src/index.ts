import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import path from "path";
import fs from "fs";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config({ quiet: true });

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    welcome: "Welcome to Productify API",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

// Static Frontend Serving
const rootDir = process.cwd().endsWith("backend")
  ? path.join(process.cwd(), "..")
  : process.cwd();

const frontendDistPath = path.join(rootDir, "frontend", "dist");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  console.warn("⚠️ Frontend build not found at:", frontendDistPath);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is up and running on PORT:", PORT));