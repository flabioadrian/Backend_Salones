import { Router } from 'express';
import * as ctrl from '../controllers/loginProcess.controller.js';

const router = Router();

// Definición de endpoints
router.post('/login', ctrl.login);
router.post('/logout', ctrl.logout);

export default router;