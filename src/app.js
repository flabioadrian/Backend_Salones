import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import salonesRoutes from './routes/salones.routes.js';
import serviciosRoutes from './routes/servicios.routes.js';
import clientesRoutes from './routes/cliente.routes.js';
import adminRoutes from './routes/admin.routes.js';
import loginRoutes from './routes/loginProcess.routes.js';
import reservasRoutes from './routes/reservas.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Montar las rutas
app.use('/api/admin', adminRoutes);
app.use('/api/salones', salonesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/cliente', clientesRoutes);
app.use('/api/', loginRoutes);
app.use('/api/reservas', reservasRoutes);

export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
}