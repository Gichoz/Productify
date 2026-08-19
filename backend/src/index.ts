import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors"; 
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

// Load environment variables from your .env file
dotenv.config({ quiet: true });

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// `credentials: true` allows the frontend to send cookies to the backend so that we can authenticate the user.
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true })); // Enable URL-encoded form data parsing
app.use(express.json()); // Enable JSON parsing middleware (good practice for APIs)
// Enable JSON parsing middleware (good practice for APIs)
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    welcome: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

// Use process.env.PORT with a fallback (e.g., 3000)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server is up and running on PORT:", PORT));


// import express from "express";
// import cors from "cors";
// import path from "path";

// import { ENV } from "./config/env";
// import { clerkMiddleware } from "@clerk/express";

// import userRoutes from "./routes/userRoutes";
// import productRoutes from "./routes/productRoutes";
// import commentRoutes from "./routes/commentRoutes";

// const app = express();

// app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
// // `credentials: true` allows the frontend to send cookies to the backend so that we can authenticate the user.
// app.use(clerkMiddleware()); // auth obj will be attached to the req
// app.use(express.json()); // parses JSON request bodies.
// app.use(express.urlencoded({ extended: true })); // parses form data (like HTML forms).

// app.get("/api/health", (req, res) => {
//   res.json({
//     message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
//     endpoints: {
//       users: "/api/users",
//       products: "/api/products",
//       comments: "/api/comments",
//     },
//   });
// });

// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/comments", commentRoutes);

// if (ENV.NODE_ENV === "production") {
//   const __dirname = path.resolve();

//   // serve static files from frontend/dist
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   // handle SPA routing - send all non-API routes to index.html - react app
//   app.get("/{*any}", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }

// app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));

