import jwt from 'jsonwebtoken';

import * as loginModel from '../models/loginProcess.model.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Datos invalidos" });

        const userFound = await loginModel.validateUser({ email, password });
        if (!userFound) return res.status(401).json({ msg: "Credenciales incorrectas" });

        const token = jwt.sign(
            { id: userFound.id, role: userFound.role }, 
            process.env.TOKEN_SECRET || process.env.TOKEN_SECRET_SECONDARY, 
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(200).json({ 
            message: "Login exitoso", 
            user: userFound
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0)
    });

    return res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, process.env.TOKEN_SECRET || process.env.TOKEN_SECRET_SECONDARY, async (err, user) => {
        if (err) return res.status(401).json({ message: "No autorizado" });

        return res.json({
            id: user.id,
            role: user.role
        });
    });
};