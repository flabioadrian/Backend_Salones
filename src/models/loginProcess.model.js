import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const validateUser = async (user) => {
    let userFound = null;

    const [clientRows] = await db.query(
        "SELECT id, nombre, password FROM cliente WHERE email = ?", 
        [user.email]
    );
    
    if (clientRows.length > 0) {
        const passwordMatch = await bcrypt.compare(user.password, clientRows[0].password);
        if (passwordMatch) {
            userFound = { id: clientRows[0].id, username: clientRows[0].nombre, role: 'client' };
        }
    } else {
        const [adminRows] = await db.query(
            "SELECT id, nombre, password FROM administrador WHERE email = ?", 
            [user.email]
        );
        if (adminRows.length > 0) {
            const passwordMatch = await bcrypt.compare(user.password, adminRows[0].password);
            if (passwordMatch) {
            userFound = { id: adminRows[0].id, username: adminRows[0].nombre, role: 'admin' };
            }
        }
    }
    return userFound;
}