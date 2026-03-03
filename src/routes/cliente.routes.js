import { Router } from 'express';
import * as ctrl from '../controllers/cliente.controller.js';

const router = Router();

// Definición de endpoints
router.get('/', ctrl.getClientes);
router.get('/:id', ctrl.getClienteById);
router.post('/', ctrl.createCliente);
router.put('/:id',ctrl.alterCliente);
router.patch('/:id/desactivar',ctrl.disableCliente);
router.patch('/:id/activar',ctrl.enableCliente);

export default router;