import db from '../config/db.js';

export const getSalonesActivos = async () => {
  // Solo lógica de DB
  const [rows] = await db.query('SELECT * FROM salon WHERE activo = 1');
  return rows;
};

export const getAllSalones = async () => {
  const [rows] = await db.query('SELECT * FROM salon');
  return rows;
};

export const getSalonById = async (id, session) => {
  if (session && session.rol === 'admin') {
    const [rows] = await db.query('SELECT * FROM salon WHERE id = ?', [id]);
    return rows[0];
  }
  const [rows] = await db.query('SELECT * FROM salon WHERE id = ? AND activo = 1', [id]);
  return rows[0];
};

export const createSalon = async (data) => {
  const { nombre, capacidad, precio, imagenUrl, descripcion } = data;
  const [result] = await db.query(
    'INSERT INTO salon (nombre, capacidad, precio, imagen, descripcion) VALUES (?,?,?,?,?)',
    [nombre, capacidad, precio, imagenUrl, descripcion]
  );
  return { id: result.insertId, ...data };
};

export const alterSalon = async (id, data) => {
  const { nombre, capacidad, precio, imagenUrl, descripcion } = data;
  const [result] = await db.query(
    'UPDATE salon SET nombre = ?, capacidad = ?, precio = ?, imagen = ?, descripcion = ? WHERE id = ?',
    [nombre, capacidad, precio, imagenUrl, descripcion, id]
  );
  if (result.affectedRows === 0) {
    throw new Error("No se encontró el salón para actualizar");
  }
  return { id, ...data };
};

export const disableSalon = async (id) => {
  const [result] = await db.query(
    'CALL sp_eliminar_sala_seguro(?, @p_msg); SELECT @p_msg AS mensaje;',
    [id]
  );
  const mensaje = result[1][0].mensaje;
  if (mensaje.includes('No se puede')) {
    throw new Error(mensaje);
  }

  return { id, mensaje };
};

export const enableSalon = async (id) => {
  const [result] = await db.query(
    'UPDATE salon SET activo = 1 WHERE id = ?',
    [id]
  );
  if (result.affectedRows === 0) {
    throw new Error("No se encontró el salón para habilitar");
  }
  return { id, activo: 1 };
};