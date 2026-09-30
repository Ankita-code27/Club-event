import { Router } from 'express';
import { firebaseConfigured } from '../config/firebase.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    firebaseConfigured,
    time: new Date().toISOString(),
  });
});

export default router;
