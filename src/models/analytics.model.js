import db from '../config/db.js';

/**
 * Obtiene el conteo de reservas y el ingreso total por mes.
 * @param {number} anioInicio - Año de inicio (opcional)
 * @param {number} anioFin - Año de fin (opcional)
 * @returns {Promise<Array>} - [{ mes, cantidad_reservas, total_ingresos }]
 */
export const getReservasPorMes = async (anioInicio = 2023, anioFin = 2024) => {
  const sql = `
    SELECT 
      DATE_FORMAT(fecha, '%Y-%m') AS mes,
      COUNT(*) AS cantidad_reservas,
      SUM(total_pagar) AS total_ingresos
    FROM reserva
    WHERE id_estado_pago = 1               # Solo pagadas
      AND YEAR(fecha) BETWEEN ? AND ?
    GROUP BY mes
    ORDER BY mes ASC
  `;
  const [rows] = await db.query(sql, [anioInicio, anioFin]);
  return rows;
};