import db from '../config/db.js';

export const getAllClientes = async () => {
  // Solo lógica de DB
  const [rows] = await db.query('SELECT * FROM cliente WHERE activo = 1');
  return rows;
};

export const getClienteById = async (id) => {
  const [rows] = await db.query('SELECT * FROM cliente WHERE id = ? AND activo = 1', [id]);
  return rows[0];
};

export const createCliente = async (data) => {
  const { nombre, aPaterno, aMaterno, telefono, email, password, direccion } = data;
  const [result] = await db.query(
    'INSERT INTO cliente (nombre, aPaterno, aMaterno, telefono, email, password, direccion) VALUES (?,?,?,?,?,?,?)',
    [nombre,  aPaterno, aMaterno, telefono, email, password, direccion ]
  );
  return { id: result.insertId, ...data };
};

export const alterCliente = async (id, data) => {
  const { nombre,  aPaterno, aMaterno, telefono, email, password, direccion } = data;
  const [result] = await db.query(
    'UPDATE cliente SET nombre = ?, aPaterno = ?, aMaterno = ?, telefono = ?, email = ?, password = ?, direccion = ? WHERE id = ?',
    [nombre, aPaterno, aMaterno, telefono, email, password, direccion, id]
  );
  if (result.affectedRows === 0) {
    throw new Error("No se encontró el cliente para actualizar");
  }
  return { id, ...data };
};

export const disableCliente = async (id) => {
  const [rows] = await db.query(
    'CALL sp_eliminar_cliente_seguro(?, @p_msg); SELECT @p_msg AS mensaje;',
    [id]
  );
  const mensajeRespuesta = rows[1][0].mensaje;

  if (mensajeRespuesta.includes('No se puede')) {
    throw new Error(mensajeRespuesta);
  }

  return { id, mensaje: mensajeRespuesta };
};

export const enableCliente = async (id) => {
  const [result] = await db.query(
    'UPDATE cliente SET activo = 1 WHERE id = ?',
    [id]
  );
  if (result.affectedRows === 0) {
    throw new Error("No se encontró el cliente para habilitar");
  }
  return { id, activo: 1 };
};

export const changePassword = async (id, body) => {
  const { pass, new_pass } = body;
  const [rows] = await db.query(
    'SELECT id FROM cliente WHERE password = MD5(?) AND id = ?',
    [pass, id]
  );

  if (rows.length === 0) {
    throw new Error("La contraseña actual es incorrecta");
  }
  const [updateResult] = await db.query(
    'UPDATE cliente SET password = MD5(?) WHERE id = ?',
    [new_pass, id]
  );

  if (updateResult.affectedRows === 0) {
    throw new Error("No se pudo actualizar la contraseña");
  }
  return { id, mensaje: "Actualización Exitosa" };
};