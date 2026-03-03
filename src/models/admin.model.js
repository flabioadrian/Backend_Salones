// models/admin.model.js
import db from '../config/db.js';

// SELECT - Todos los administradores
export const getAllAdmins = async () => {
  const [rows] = await db.query(
    'SELECT id, nombre, aPaterno, aMaterno, email FROM administrador'
  );
  return rows;
};

// SELECT - Administrador por ID
export const getAdminById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, nombre, aPaterno, aMaterno, email FROM administrador WHERE id = ?',
    [id]
  );
  return rows[0];
};

// UPDATE - Actualizar administrador
export const updateAdmin = async (id, data) => {
  const { nombre, aPaterno, aMaterno, email, password } = data;
  
  let query = 'UPDATE administrador SET ';
  const values = [];
  
  if (nombre) {
    query += 'nombre = ?, ';
    values.push(nombre);
  }
  if (aPaterno) {
    query += 'aPaterno = ?, ';
    values.push(aPaterno);
  }
  if (aMaterno !== undefined) {
    query += 'aMaterno = ?, ';
    values.push(aMaterno);
  }
  if (email) {
    query += 'email = ?, ';
    values.push(email);
  }
  if (password) {
    query += 'password = ?, ';
    values.push(password);
  }
  
  // Eliminar la última coma y espacio
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  values.push(id);
  
  const [result] = await db.query(query, values);
  
  if (result.affectedRows === 0) {
    throw new Error("No se encontró el administrador para actualizar");
  }
  
  // Obtener los datos actualizados para devolverlos
  const adminActualizado = await getAdminById(id);
  return adminActualizado;
};
