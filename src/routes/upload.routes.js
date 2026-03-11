import { Router } from 'express';
import multer from 'multer';
import * as ctrl from '../controllers/upload.controller.js';
import { authRequired, isAdmin } from '../middlewares/validateToken.js';

const router = Router();

// Configuración básica de multer en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Solo administradores deberían poder subir fotos de salones
router.post('/', authRequired, isAdmin, upload.single('image'), ctrl.uploadImage);

export default router;