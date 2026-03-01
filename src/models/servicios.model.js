import db from '../config/db.js';

export const getAllServicios = async () => {
  // Traemos los alumnos y el nombre de su grupo
  const [rows] = await db.query(`
    SELECT * FROM servicio WHERE activo = 1
  `);
  return rows;
};

export const getServicioById = async (id) => {
  const [rows] = await db.query('SELECT * FROM servicio WHERE id = ? AND activo = 1', [id]);
  return rows[0];
};

export const createServicio = async (data) => {
  const { nombre, costo, descripcion } = data;
  const [result] = await db.query(
    'INSERT INTO servicio (nombre, costo, descripcion) VALUES (?, ?, ?)',
    [nombre, costo, descripcion ]
  );
  return { id: result.insertId, ...data};
};

export const alterServicio = async (id, data) => {
  const { nombre, costo, descripcion } = data;
  const [result] = await db.query(
    'UPDATE servicio SET nombre = ?, costo = ?, descripcion = ? WHERE id = ?',
    [nombre, costo, descripcion , id]
  );

  if (result.affectedRows === 0) {
    throw new Error("No se encontró el salón para actualizar");
  }
  return { id, ...data };
};

export const disableServicio = async (id) => {
  const [result] = await db.query(
    'UPDATE servicio SET activo = 0 WHERE id = ?',
    [ id]
  );

  if (result.affectedRows === 0) {
    throw new Error("No se encontró el salón para deshabilitar");
  }
  return { id, activo: 0 };
};

export const enableServicio = async (id) => {
  const [result] = await db.query(
    'UPDATE servicio SET activo = 1 WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("No se encontró el salón para habilitar");
  }
  return { id, activo: 1 };
};