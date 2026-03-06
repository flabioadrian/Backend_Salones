import { Router } from 'express';
import * as ctrl from '../controllers/reservas.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/validateToken.js';

const router = Router();
// 1. RUTAS DE BÚSQUEDA ESPECÍFICA (Prioridad Alta)
router.get('/cliente', authRequired, ctrl.getReservaClient);
router.get('/cliente/info/:id_reserva', authRequired, ctrl.getReservaClientbyID);

// 2. RUTAS DE VALIDACIÓN Y CÁLCULO (Antes de los IDs genéricos)
router.post('/calcular-presupuesto', authRequired, ctrl.obtenerPresupuesto);
router.post('/check-disponibilidad/:id', authRequired, ctrl.reservaOcupada);

// 3. RUTAS DINÁMICAS POR ID
router.get('/', authRequired, isAdmin, ctrl.getReservas); // Ver todas
router.get('/:id', authRequired, isAdmin, ctrl.getReservaById);
router.post('/', authRequired, ctrl.createReserva);
router.put('/:id', authRequired, ctrl.alterReserva);

// 4. CAMBIO DE ESTADOS
router.patch('/:id/desactivar', authRequired, ctrl.disableReserva);
router.patch('/:id/activar', authRequired, isAdmin, ctrl.enableReserva);

export default router;