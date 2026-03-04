import { Router } from 'express';
import * as ctrl from '../controllers/reservas.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/validateToken.js';

const router = Router();
// Ver todas (Solo Admin)
router.get('/', authRequired, isAdmin, ctrl.getReservas);
// Ver reservas de un cliente específico (Historial)
router.get('/cliente', authRequired, ctrl.getReservaClient);
// Ver una reserva específica
router.get('/:id', authRequired, isAdmin, ctrl.getReservaById);
router.get('/cliente/info/:id_reserva', authRequired, ctrl.getReservaClientbyID);

// --- RUTAS DE VALIDACIÓN ---
// Útil para que el frontend verifique disponibilidad en tiempo real
router.post('/check-disponibilidad/:id', authRequired, ctrl.reservaOcupada);
router.post('/calcular-presupuesto', authRequired, ctrl.obtenerPresupuesto);
// --- RUTAS DE ACCIÓN ---
router.post('/', authRequired, ctrl.createReserva);
router.put('/:id', authRequired, ctrl.alterReserva);
// Cambio de estados
router.patch('/:id/desactivar', authRequired, ctrl.disableReserva);
router.patch('/:id/activar', authRequired, isAdmin, ctrl.enableReserva);

export default router;