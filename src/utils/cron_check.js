import cron from 'node-cron';
import { logger } from './logger.js';

export const iniciarCronCancelaciones = () => {
    // Se ejecuta cada hora
    cron.schedule('0 * * * *', async () => {
        try {
            logger.info('Iniciando proceso de validación de tiempos en auditoría...');

            const sql = `
                UPDATE reserva r
                INNER JOIN auditoria_reservas a ON r.id = a.id_reserva
                SET r.id_estado_pago = 3
                WHERE r.id_estado_pago = 2 
                AND a.fecha_cambio < NOW() - INTERVAL 8 HOUR
            `;

            const [result] = await db.query(sql);

            if (result.affectedRows > 0) {
                logger.info(`Se han cancelado ${result.affectedRows} reservas basadas en el historial de auditoría.`);
            } else {
                logger.info('No hay reservas pendientes que excedan el tiempo límite.');
            }

        } catch (error) {
            logger.error('Error al ejecutar el barrido de cancelaciones:', error);
        }
    });
};

export const ejecutarBarridoCancelaciones = async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: "No autorizado" });
    }
    try {
        logger.info('Ejecutando barrido manual de cancelaciones...');
        const sql = `
            UPDATE reserva r
            INNER JOIN auditoria_reservas a ON r.id = a.id_reserva
            SET r.id_estado_pago = 3
            WHERE r.id_estado_pago = 2 
            AND a.fecha_cambio < NOW() - INTERVAL 8 HOUR
        `;
        const [result] = await db.query(sql);
        res.json({
            mensaje: "Barrido completado",
            cancelados: result.affectedRows
        });
    } catch (error) {
        logger.error('Error en el barrido:', error);
        res.status(500).json({ error: "Fallo el proceso de limpieza" });
    }
};