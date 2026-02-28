import { Router } from 'express';
import * as ctrl from '../controllers/salones.controller.js';

const router = Router();

// Definición de endpoints
router.get('/', ctrl.getSalones);
router.post('/', ctrl.createSalon);

export default router;