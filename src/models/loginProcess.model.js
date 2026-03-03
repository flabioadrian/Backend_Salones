import db from '../config/db.js';

export const validateUser = async (user) => {
    let userFound = null;

    const [clientRows] = await db.query(
        "SELECT id, nombre FROM cliente WHERE email = ? AND password = MD5(?)", 
        [user.email, user.password]
    );

    if (clientRows.length > 0) {
        userFound = { id: clientRows[0].id, username: clientRows[0].nombre, role: 'client' };
    } else {
        const [adminRows] = await db.query(
            "SELECT id, nombre FROM administrador WHERE email = ? AND password = MD5(?)", 
            [user.email, user.password]
        );
        if (adminRows.length > 0) {
            userFound = { id: adminRows[0].id, username: adminRows[0].nombre, role: 'admin' };
        }
    }
    return userFound;
}