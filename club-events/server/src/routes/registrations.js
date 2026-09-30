import { Router } from 'express';
import { register, getRegistrations } from '../controllers/registrationsController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// Public
router.post('/', register);

// Admin (real auth enforcement, Phase 7)
router.get('/', requireAdmin, getRegistrations);

export default router;
