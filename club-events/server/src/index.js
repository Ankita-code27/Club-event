import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import './config/firebase.js';
import healthRoutes from './routes/health.js';
import eventsRoutes from './routes/events.js';
import registrationsRoutes from './routes/registrations.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: '100kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.use('/api/health', healthRoutes);
app.use('/api/events', eventsRoutes);
// Admin-intended routes are protected by requireAdmin (see middleware/requireAdmin.js
// and routes/events.js, routes/registrations.js) as of Phase 7.
app.use('/api/registrations', registrationsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[server] Listening on http://localhost:${env.port}`);
});
