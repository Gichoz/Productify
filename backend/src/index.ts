import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors"; 
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import path from "path";
import fs from "fs";

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

// 1. REGISTER API ROUTES (Matching direct frontend path expectations)
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/comments", commentRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    welcome: "Welcome to Productify API",
    endpoints: {
      users: "/users",
      products: "/products",
      comments: "/comments",
    },
  });
});

// 2. STATIC FRONTEND SERVING
const rootDir = process.cwd().endsWith("backend") 
  ? path.join(process.cwd(), "..") 
  : process.cwd();

const frontendDistPath = path.join(rootDir, "frontend", "dist");

if (fs.existsSync(frontendDistPath)) {
  // Serve static assets (JS, CSS, images) from frontend/dist
  app.use(express.static(frontendDistPath));

  // Catch all remaining GET requests and send index.html (Express v5 syntax)
  app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  console.warn("⚠️ Frontend build not found at:", frontendDistPath);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is up and running on PORT:", PORT));