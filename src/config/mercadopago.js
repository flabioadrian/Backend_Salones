import { MercadoPagoConfig } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();

export const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});