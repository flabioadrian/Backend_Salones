import { Router } from 'express';
import * as ctrl from '../controllers/cliente.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/validateToken.js';

const router = Router();

// Definición de endpoints
router.get('/', authRequired, isAdmin, ctrl.getClientes);
router.get('/info', authRequired, ctrl.getInfoClient);
router.get('/:id', authRequired, isAdmin, ctrl.getClienteById);
router.post('/', ctrl.createCliente);
router.put('/edit', authRequired, ctrl.alterInfoCliente);
router.put('/:id', authRequired, isAdmin, ctrl.alterCliente);
router.patch('/:id/desactivar', authRequired, ctrl.disableCliente);
router.patch('/:id/activar', authRequired, isAdmin,ctrl.enableCliente);

export default router;