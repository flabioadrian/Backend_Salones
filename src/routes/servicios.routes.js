import { Router } from 'express';
import * as ctrl from '../controllers/servicios.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/validateToken.js';

const router = Router();

router.get('/', ctrl.getServicios);
router.get('/:id', ctrl.getServicioById);
router.post('/', authRequired, isAdmin, ctrl.createServicio);
router.put('/:id',authRequired, isAdmin, ctrl.alterServicio);
router.patch('/:id/desactivar',authRequired, isAdmin, ctrl.disableServicio);
router.patch('/:id/activar', authRequired, isAdmin, ctrl.enableServicio);

export default router;