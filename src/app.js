import express from 'express';
import cors from 'cors';
import salonesRoutes from './routes/salones.routes.js';
import serviciosRoutes from './routes/servicios.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Montar las rutas en sus respectivos endpoints
app.use("/api/admin", adminRoutes);  
app.use('/api/salones', salonesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/clientes', clienteRoutes);

// Exportar para Vercel (Serverless)
export default app;

// Iniciar servidor localmente (si no es producción)
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
}