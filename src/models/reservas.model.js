import db from '../config/db.js';

export const getAllReservas = async () => {
  // Solo lógica de DB
  const [rows] = await db.query('SELECT * FROM vista_reservas_completas');
  return rows;
};

export const getReservaById = async (id) => {
  const [rows] = await db.query('SELECT * FROM vista_reservas_completas WHERE id = ?', [id]);
  return rows[0];
};

export const getReservaClient = async (id) => {
  const [rows] = await db.query('SELECT * FROM vista_reservas_completas WHERE id_cliente = ?', [id]);
  return rows;
};

export const getReservaClientbyID = async (id_cliente, id_reserva) => {
  const [rows] = await db.query('SELECT * FROM vista_reservas_completas WHERE id_cliente = ? AND id = ?', [id_cliente, id_reserva]);
  return rows;
};

export const createReserva = async (data) => {
  const { id_cliente, id_salon, fecha, hora_inicio, hora_fin, id_servicio } = data;
  
  // 1. Ejecutar el procedimiento
  await db.query(
    'CALL sp_crear_reserva(?, ?, ?, ?, ?, ?, @p_id, @p_msg)',
    [id_cliente, id_salon, fecha, hora_inicio, hora_fin, id_servicio]
  );

  // 2. Recuperar los resultados de las variables de salida
  const [rows] = await db.query('SELECT @p_id AS id, @p_msg AS mensaje');
  const info = rows[0]; 

  if (info.id === null) {
    throw new Error(info.mensaje);
  }
  
  return { id: info.id, mensaje: info.mensaje, ...data };
};

export const fechaOcupada = async (id, data) => {
  const { id_salon, fecha, hora_inicio, hora_fin } = data;

  const [validacion] = await db.query(
    'SELECT validar_disponibilidad_sala(?, ?, ?, ?, ?) AS disponible',
    [id_salon, fecha, hora_inicio, hora_fin, id]
  );

  return !validacion[0].disponible;
};

export const obtenerPresupuesto = async (id_sala, id_servicio) => {
  const [rows] = await db.query(
    'SELECT calcular_total_reserva(?, ?) AS total_calculado',
    [id_sala, id_servicio]
  );
  return rows[0].total_calculado;
};

export const alterReserva = async (id, data, userSession) => {
  const { id_cliente, id_salon, fecha, hora_inicio, hora_fin, id_estado_pago, id_servicio } = data;

  await validarUsuarioReserva(id, userSession);

  const [result] = await db.query(
    `UPDATE reserva 
     SET id_cliente = ?, 
         id_salon = ?, 
         fecha = ?, 
         hora_inicio = ?, 
         hora_fin = ?, 
         id_estado_pago = ?, 
         id_servicio = ?,
         total_pagar = calcular_total_reserva(?, ?) 
     WHERE id = ?`,
    [
      id_cliente, 
      id_salon, 
      fecha, 
      hora_inicio, 
      hora_fin, 
      id_estado_pago, 
      id_servicio, 
      id_salon,    // p_id_sala para la función
      id_servicio, // p_id_servicio para la función
      id           // id para el WHERE
    ]
  );
  if (result.affectedRows === 0) {
    throw new Error("No se encontró la reserva para actualizar");
  }

  return { id, ...data };
};

export const cancelReserva = async (id, userSession) => {
  await validarUsuarioReserva(id, userSession);

  const [result] = await db.query(
    'UPDATE reserva SET id_estado_pago = 3 WHERE id = ?',
    [id]
  );
  if (result.affectedRows === 0) {
    throw new Error("No se encontró la reserva para cancelar");
  }
  return { id, activo: 0 };
};

async function validarUsuarioReserva(id, userSession) {
  const { role, id: userIdSession } = userSession; 

  if (role === 'client') {
    const [reserva] = await db.query('SELECT id_cliente FROM reserva WHERE id = ?', [id]);
    if (reserva.length === 0) {
      throw new Error("Reserva no encontrada");
    }
    if (Number(reserva[0].id_cliente) !== Number(userIdSession)) {
      throw new Error("No tienes permiso para editar esta reserva");
    }
  }
}

export const confirmarReserva = async (id) => {
  const [result] = await db.query(
    'UPDATE reserva SET id_estado_pago = 1 WHERE id = ?',
    [id]
  );
  if (result.affectedRows === 0) {
    throw new Error("No se encontró la reserva para confirmar");
  }
  return { id, activo: 1 };
};