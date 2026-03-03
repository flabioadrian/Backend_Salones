// routes/admin.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/admin.controller.js';

const router = Router();

router.get('/', ctrl.getAdmins);
router.get('/:id', ctrl.getAdminById);
router.put('/:id', ctrl.updateAdmin);


export default router;