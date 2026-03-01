import db from '../config/db.js';

export const getAllSalones = async () => {
  // Solo lógica de DB
  const [rows] = await db.query('SELECT * FROM salones WHERE activo = 1');
  return rows;
};

export const createSalon = async ({ nombre, capacidad, precio, imagenUrl, descripcion }) => {
  const [result] = await db.query(
    'INSERT INTO salones (nombre, capacidad, precio, imagen, descripcion) VALUES (?,?,?,?,?)',
    [nombre, capacidad, precio, imagenUrl, descripcion]
  );
  return { id: result.insertId, nombre, capacidad, precio, imagenUrl, descripcion };
};