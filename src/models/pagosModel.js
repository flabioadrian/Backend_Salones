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
    const [existente] = await db.query('SELECT id FROM pago_detalles WHERE mp_payment_id = ?', [paymentId]);
    if (existente.length > 0) {
        console.log(`El pago ${paymentId} ya estaba registrado. Ignorando duplicado.`);
        return; 
    }
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

export const getDetallesPagoPorReserva = async (id_reserva) => {
    const sql = `SELECT mp_payment_id, monto_pagado FROM pago_detalles WHERE id_reserva = ?`;
    const [rows] = await db.query(sql, [id_reserva]);
    return rows.length > 0 ? rows[0] : null;
};

export const procesarReembolsoMP = async (paymentId, monto) => {
    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN.trim()}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': `refund-${paymentId}-${Date.now()}`
            },
            body: JSON.stringify({
                amount: parseFloat(monto.toFixed(2))
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error API Mercado Pago:", data);
            throw new Error(data.message || "Error en el reembolso");
        }

        return data;
    } catch (err) {
        throw new Error(`Fallo en la comunicación con MP: ${err.message}`);
    }
};