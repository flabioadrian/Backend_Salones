import { Router } from 'express';
import { getAnalisisTemporadas } from '../controllers/analytics.controller.js';
import { authRequired, isAdmin } from '../middlewares/validateToken.js';

const router = Router();

router.get('/temporadas', authRequired, isAdmin, getAnalisisTemporadas);

export default router;