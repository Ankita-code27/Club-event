import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import "./config/firebase.js";
import healthRoutes from "./routes/health.js";
import eventsRoutes from "./routes/events.js";
import registrationsRoutes from "./routes/registrations.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());

// Dynamic CORS configuration allowing localhost, configured origin, and any Vercel deployment
const allowedOrigins = [
  env.clientOrigin,
  "https://club-event-gold.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Route aliases to satisfy both /api/events and /events frontend requests
app.use("/api/health", healthRoutes);
app.use("/health", healthRoutes);

app.use("/api/events", eventsRoutes);
app.use("/events", eventsRoutes);

// Admin-intended routes
app.use("/api/registrations", registrationsRoutes);
app.use("/registrations", registrationsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[server] Listening on http://localhost:${env.port}`);
});
