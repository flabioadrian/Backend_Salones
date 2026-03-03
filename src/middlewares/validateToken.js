import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "No hay token, autorización denegada" });

    jwt.verify(token, process.env.TOKEN_SECRET || process.env.TOKEN_SECRET_SECONDARY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido" });

        // Guardamos los datos decodificados (id, role) en el request
        req.user = user;
        
        next(); // Le damos paso a la siguiente función
    });
};

export const isAdmin = (req, res, next) => {
    // IMPORTANTE: Este middleware debe ir DESPUÉS de authRequired
    // porque authRequired es el que llena el objeto req.user
    
    if (!req.user) {
        return res.status(500).json({ message: "Se requiere verificar el token primero" });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: "Acceso denegado: Se requieren permisos de administrador" 
        });
    }

    next(); // Si es admin, lo dejamos pasar
};