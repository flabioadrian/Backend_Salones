import db from '../config/db.js';

export const getAllSalones = async () => {
  // Solo lógica de DB
  const [rows] = await db.query('SELECT * FROM salones WHERE activo = 1');
  return rows;
};

export const createGrupo = async ({ nombre_grupo }) => {
  const [result] = await db.query(
    'INSERT INTO salones (nombre, capacidad, precio, imagen, descripcion, activo) VALUES (?,?,?,?,?,?)',
    [nombre_grupo]
  );
  return { id: result.insertId, nombre_grupo };
};