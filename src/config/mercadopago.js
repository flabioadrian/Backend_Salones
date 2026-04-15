import { PaymentRefund, MercadoPagoConfig } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();

export const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: { 
        timeout: 5000 
    }
});

export const refundClient = new PaymentRefund(client);