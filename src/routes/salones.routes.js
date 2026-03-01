import { Router } from 'express';
import * as ctrl from '../controllers/salones.controller.js';

const router = Router();

// Definición de endpoints
router.get('/', ctrl.getSalones);
router.get('/:id', ctrl.getSalonById);
router.post('/', ctrl.createSalon);
router.put('/:id',ctrl.alterSalon);
router.patch('/:id/desactivar',ctrl.disableSalon);
router.patch('/:id/activar',ctrl.enableSalon);

export default router;