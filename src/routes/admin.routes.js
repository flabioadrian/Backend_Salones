// routes/admin.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/admin.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/validateToken.js';

const router = Router();

router.get('/', authRequired, isAdmin, ctrl.getAdmins);
router.get('/:id', authRequired, isAdmin, ctrl.getAdminById);
router.put('/:id', authRequired, isAdmin, ctrl.updateAdmin);


export default router;