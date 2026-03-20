import { error } from 'node:console';
import db from '../config/db.js'

export const getInfoReservaClient = async (id_reserva) => {
    const sql = `SELECT * FROM vista_reservas_completas WHERE id = ?`;
    const [rows] = await db.query(sql, [id_reserva]);

    if (rows.length === 0) {
        throw new Error("No se encontró la información de la reserva");
    }

    const info = rows[0];
    return info;
};

export const actualizarEstadoPago = async (payment, paymentId) => {
    console.log(payment);
    const prefId = payment.preference_id || payment.order?.id || 'N/A';
    const params = [
        payment.external_reference, // p_id_reserva
        paymentId,                  // p_mp_payment_id
        prefId,                     // p_mp_preference_id
        payment.payment_method_id,  // p_metodo_pago
        payment.transaction_amount   // p_monto_pagado
    ];

    // Llamamos al procedimiento almacenado
    await db.query('CALL sp_registrar_pago_exitoso(?, ?, ?, ?, ?)', params);
    
    console.log(`Procedimiento ejecutado para reserva: ${payment.external_reference}`);
};