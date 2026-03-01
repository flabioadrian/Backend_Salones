import db from '../config/db.js';
import jwt from 'jsonwebtoken';
// No necesitas importar el .env aquí, solo asegúrate de tener

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Datos invalidos" });

        let userFound = null;

        // 1. Buscar en Clientes (Usando ? para evitar Inyección SQL)
        const [clientRows] = await db.query(
            "SELECT id, nombre FROM cliente WHERE email = ? AND password = MD5(?)", 
            [email, password]
        );

        if (clientRows.length > 0) {
            userFound = { id: clientRows[0].id, username: clientRows[0].nombre, role: 'client' };
        } else {
            // 2. Si no es cliente, buscar en Administrador
            const [adminRows] = await db.query(
                "SELECT id, nombre FROM administrador WHERE email = ? AND password = MD5(?)", 
                [email, password]
            );
            if (adminRows.length > 0) {
                userFound = { id: adminRows[0].id, username: adminRows[0].nombre, role: 'admin' };
            }
        }

        // 3. Validar si encontramos a alguien
        if (!userFound) return res.status(401).json({ msg: "Credenciales incorrectas" });

        // 4. Crear el Token (Usando process.env)
        const token = jwt.sign(
            { id: userFound.id, role: userFound.role }, 
            process.env.TOKEN_SECRET || process.env.TOKEN_SECRET_SECONDARY, 
            { expiresIn: '1d' }
        );

        // 5. Enviar Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Solo true en producción (HTTPS)
            sameSite: 'lax'
        });

        res.json({ 
            message: "Login exitoso", 
            user: userFound 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};