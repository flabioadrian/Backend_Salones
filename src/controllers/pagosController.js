import { Preference } from 'mercadopago';
import { client } from '../config/mercadopago.js';
import * as pagoModel from '../models/pagosModel.js';

export const crearPreferencia = async (req, res) => {
    try {
        const { id_reserva, origin_url } = req.body;
        const baseUrl = origin_url || process.env.FRONTEND_URL;

        const info = await pagoModel.getInfoReservaClient(id_reserva);

        const preference = new Preference(client);
        const body = {
            items: [
                {
                    id: info.id.toString(),
                    title: `${info.nombre_servicio || 'Reserva'} - ${info.nombre_sala}`,
                    quantity: 1,
                    unit_price: Number(info.total_pagar),
                    currency_id: 'MXN',
                }
            ],
            external_reference: info.id.toString(), 
            back_urls: {
                success: `${baseUrl}/estado-pago.html?result=success`,
                failure: `${baseUrl}/estado-pago.html?result=failure`,
                pending: `${baseUrl}/estado-pago.html?result=pending`
            },
            auto_return: "approved",
            notification_url: `${process.env.URL_BASE_API}/api/pagos/webhook`,
        };

        const response = await preference.create({ body });

        // Enviamos el ID de la preferencia al frontend para que abra el checkout
        res.json({ id: response.id, init_point: response.init_point });

    } catch (error) {
        console.error("Error al crear preferencia con vista:", error);
        res.status(500).json({ error: "Error interno al procesar el pago" });
    }
};

export const recibirWebhookMP = async (req, res) => {
    try {
        const { body, query } = req;
        
        // MP envía el ID de diferentes formas dependiendo del tipo de notificación
        const paymentId = body.data?.id || query.id || query['data.id'];
        const type = body.type || query.topic || query.type;

        if (type === 'payment' && paymentId) {
            const paymentClient = new Payment(client);
            const payment = await paymentClient.get({ id: paymentId });

            if (payment.status === 'approved') {
                await pagoModel.actualizarEstadoPago(payment, paymentId);
            }
        }
        res.status(200).send('OK');

    } catch (error) {
        console.error('Error en Webhook:', error);//en caso de bucles mandar 200 en lugar de 500 ya que el error sera de logica del api
        res.status(500).json({ error: "Error interno" });
    }
};