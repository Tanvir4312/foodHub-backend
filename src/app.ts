import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import cors from "cors";
import { adminRouter } from "./modules/admin/admin.router";
import errorHandler from "./middleware/globalErrorHandler";
import { providerRouter } from "./modules/provider/provider.router";
import { orderRouter } from "./modules/order/order.router";
import { customerRouter } from "./modules/customer/customer.router";
import { publicRouter } from "./modules/public/public.router";
import { userRouter } from "./modules/user/user.router";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",

    credentials: true,
  }),
);

// app.use(
//   cors({

//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         "https://foodhub-client-nine.vercel.app",
//         "http://localhost:3000",
//       ];

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//   }),
// );

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

// Admin
app.use("/api/admin", adminRouter);

// Provider
app.use("/api/provider", providerRouter);

// Order
app.use("/api/order", orderRouter);

// Customer
app.use("/api/customer", customerRouter);

// User
app.use("/api", userRouter);

// Public apis
app.use("/api", publicRouter);

// Error Handler
app.use(errorHandler);

app.get("/", async (req, res) => {
  res.send("Server Running");
});

export default app;
