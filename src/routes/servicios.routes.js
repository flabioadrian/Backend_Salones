import { Router } from 'express';
import * as ctrl from '../controllers/servicios.controller.js';

const router = Router();

router.get('/', ctrl.getServicios);
router.get('/:id', ctrl.getServicioById);
router.post('/', ctrl.createServicio);
router.put('/:id',ctrl.alterServicio);
router.patch('/:id/desactivar',ctrl.disableServicio);
router.patch('/:id/activar',ctrl.enableServicio);

export default router;