import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getAllClientes = async () => {
  // Solo lógica de DB
  const [rows] = await db.query('SELECT id, nombre, aPaterno, aMaterno, telefono, email, activo, direccion FROM cliente');
  return rows;
};

export const getClienteById = async (id) => {
  const [rows] = await db.query('SELECT * FROM cliente WHERE id = ? AND activo = 1', [id]);
  if (rows.length === 0) return null;
  const { password, ...datosSinPassword } = rows[0];
  return { 
    ...datosSinPassword, 
    password: "******" 
  };
};

export const createCliente = async (data) => {
  const { nombre, aPaterno, aMaterno, telefono, email, password, direccion } = data;
  const nombreF = formatNameExtra(nombre);
  const aPaternoF = formatNameExtra(aPaterno);
  const aMaternoF = formatNameExtra(aMaterno);
  const emailF = email.trim().toLowerCase();
  let passwordHasheado = await hashContrasenia(password);
  const [result] = await db.query(
    'INSERT INTO cliente (nombre, aPaterno, aMaterno, telefono, email, password, direccion) VALUES (?,?,?,?,?,?,?)',
    [nombreF, aPaternoF, aMaternoF, telefono, emailF, passwordHasheado, direccion]
  );
  return { id: result.insertId, nombre: nombreF, aPaterno: aPaternoF, aMaterno: aMaternoF, telefono, email: emailF, direccion };
};

export const hashContrasenia = async (passwordPlano) => {
    const saltRounds = 10; 
    const passwordHasheado = await bcrypt.hash(passwordPlano, saltRounds);
    return passwordHasheado;
};

export const formatNameExtra = (str) => {
    return str
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const alterCliente = async (id, data) => {
  const { nombre,  aPaterno, aMaterno, telefono, email, password, direccion } = data;
  const nombreF = formatNameExtra(nombre);
  const aPaternoF = formatNameExtra(aPaterno);
  const aMaternoF = formatNameExtra(aMaterno);
  const emailF = email.trim().toLowerCase();
  const [result] = await db.query(
    'UPDATE cliente SET nombre = ?, aPaterno = ?, aMaterno = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
    [nombreF, aPaternoF, aMaternoF, telefono, emailF, direccion, id]
  );
  if (result.affectedRows === 0) {
    throw new Error("No se encontró el cliente para actualizar");
  }
  return { id, nombre: nombreF, aPaterno: aPaternoF, aMaterno: aMaternoF, telefono, email: emailF, direccion };
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
    'SELECT id, password FROM cliente WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    throw new Error("Usuario no encontrado");
  }
  const passwordMatch = await bcrypt.compare(pass, rows[0].password);
  if (!passwordMatch) {
    throw new Error("La contraseña actual es incorrecta");
  }
  let newPasswordHasheada = await hashContrasenia(new_pass);
  const [updateResult] = await db.query(
    'UPDATE cliente SET password = ? WHERE id = ?',
    [newPasswordHasheada, id]
  );

  if (updateResult.affectedRows === 0) {
    throw new Error("No se pudo actualizar la contraseña");
  }
  return { id, mensaje: "Actualización Exitosa" };
};