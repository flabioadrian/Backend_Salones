import { Router } from 'express';
import * as ctrl from '../controllers/reservas.controller.js';
import { authRequired, isAdmin } from '../middlewares/validateToken.js';

const router = Router();

// 1. RUTAS ESTÁTICAS (Sin parámetros :id)
router.get('/cliente', authRequired, ctrl.getReservaClient);
router.post('/calcular-presupuesto', authRequired, ctrl.obtenerPresupuesto);
router.post('/creater/', authRequired, isAdmin, ctrl.createReserva); // Ruta de admin específica

// 2. RUTAS DINÁMICAS ESPECÍFICAS (Sub-recursos)
router.get('/cliente/info/:id_reserva', authRequired, ctrl.getReservaClientbyID);
router.post('/check-disponibilidad/:id', authRequired, ctrl.reservaOcupada);

// 3. CAMBIOS DE ESTADO (Antes de los métodos genéricos de ID)
router.patch('/:id/desactivar', authRequired, ctrl.disableReserva);
router.patch('/:id/activar', authRequired, isAdmin, ctrl.enableReserva);

// 4. RUTAS GENÉRICAS DE RECURSO (El "Comodín")
router.get('/', authRequired, isAdmin, ctrl.getReservas); 
router.get('/:id', authRequired, isAdmin, ctrl.getReservaById);
router.post('/', authRequired, ctrl.createReservaClient);
router.put('/:id', authRequired, ctrl.alterReserva);

export default router;