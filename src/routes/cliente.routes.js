import { Router } from 'express';
import * as ctrl from '../controllers/cliente.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/validateToken.js';

const router = Router();

// Definición de endpoints
router.get('/', authRequired, isAdmin, ctrl.getClientes);
router.get('/:id', authRequired, ctrl.getClienteById);
router.post('/', ctrl.createCliente);
router.put('/:id', authRequired, ctrl.alterCliente);
router.patch('/:id/desactivar', authRequired, ctrl.disableCliente);
router.patch('/:id/activar', ctrl.enableCliente);

export default router;