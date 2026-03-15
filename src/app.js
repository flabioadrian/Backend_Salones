import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import salonesRoutes from './routes/salones.routes.js';
import serviciosRoutes from './routes/servicios.routes.js';
import clientesRoutes from './routes/cliente.routes.js';
import adminRoutes from './routes/admin.routes.js';
import loginRoutes from './routes/loginProcess.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    process.env.FRONTEND_PAGE_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS: Origen no permitido'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// Montar las rutas
app.use('/api/admin', adminRoutes);
app.use('/api/salones', salonesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/cliente', clientesRoutes);
app.use('/api/', loginRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/upload', uploadRoutes);

export default app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
}