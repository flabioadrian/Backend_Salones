import { Router } from 'express';
import * as ctrl from '../controllers/salones.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/validateToken.js';

const router = Router();

// Definición de endpoints
router.get('/', ctrl.getSalones);
router.get('/:id', ctrl.getSalonById);
router.post('/', authRequired, isAdmin, ctrl.createSalon);
router.put('/:id',authRequired, isAdmin, ctrl.alterSalon);
router.patch('/:id/desactivar',authRequired, isAdmin, ctrl.disableSalon);
router.patch('/:id/activar', authRequired, isAdmin, ctrl.enableSalon);

export default router;