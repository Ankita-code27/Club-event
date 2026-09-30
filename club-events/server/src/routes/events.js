import { Router } from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getAllEventsAdmin } from '../controllers/eventsController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// Public
router.get('/', getEvents);

// Admin (real auth enforcement, Phase 7)
router.get('/admin/all', requireAdmin, getAllEventsAdmin);
router.post('/', requireAdmin, createEvent);
router.put('/:id', requireAdmin, updateEvent);
router.delete('/:id', requireAdmin, deleteEvent);

// Public (kept last: '/:id' would otherwise shadow nothing here since Express
// matches by segment count, but ordering admin routes first keeps intent clear)
router.get('/:id', getEvent);

export default router;
