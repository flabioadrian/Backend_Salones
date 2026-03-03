import { Router } from 'express';
import * as ctrl from '../controllers/loginProcess.controller.js';

const router = Router();

// Definición de endpoints
router.post('/login', ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/verify', ctrl.verifyToken); // Esta es la ruta que usará el frontend al cargar la página

export default router;