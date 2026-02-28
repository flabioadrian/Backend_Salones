import db from '../config/db.js';

export const getAllServicios = async () => {
  // Traemos los alumnos y el nombre de su grupo
  const [rows] = await db.query(`
    SELECT * FROM servicios WHERE activo = 1
  `);
  return rows;
};

export const createServicio = async (data) => {
  const { matricula, nombre, id_grupo } = data;
  await db.query(
    'INSERT INTO servicios (nombre, costo, descripcion, activo) VALUES (?, ?, ?, TRUE)',
    [matricula, nombre, id_grupo || null]
  );
  return { matricula, nombre, id_grupo };
};