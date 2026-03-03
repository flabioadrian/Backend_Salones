import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import salonesRoutes from './routes/salones.routes.js';
import serviciosRoutes from './routes/servicios.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import loginRoutes from './routes/loginProcess.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Reemplaza con la URL de tu frontend (Vite, React, etc.)
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Montar las rutas en sus respectivos endpoints
app.use('/api/salones', salonesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api', loginRoutes);

// Exportar para Vercel (Serverless)
export default app;

// Iniciar servidor localmente (si no es producción)
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
}