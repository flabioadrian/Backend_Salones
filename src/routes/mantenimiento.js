import { Router } from 'express';
import * as ctrl from '../utils/cron_check.js';

const router = Router();

router.get('/barrido', ctrl.ejecutarBarridoCancelaciones); // Limpieza manual de cancelaciones

export default router;