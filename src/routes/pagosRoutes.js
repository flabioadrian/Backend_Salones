import express from 'express';
import { crearPreferencia } from '../controllers/pagosController.js';
import { recibirWebhookMP } from '../controllers/pagosController.js';

const router = express.Router();

router.post('/crear-preferencia', crearPreferencia);
router.post('/webhook', recibirWebhookMP);

export default router;