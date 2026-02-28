import { Router } from 'express';
import * as ctrl from '../controllers/servicios.controller.js';

const router = Router();

router.get('/', ctrl.getServicios);
router.post('/', ctrl.createServicio);

export default router;