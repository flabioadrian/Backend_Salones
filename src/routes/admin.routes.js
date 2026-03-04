// routes/admin.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/admin.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/validateToken.js';

const router = Router();

router.use(authRequired, isAdmin);

router.get('/', ctrl.getAdmins);
router.get('/:id', ctrl.getAdminById);
router.put('/:id', ctrl.updateAdmin);


export default router;