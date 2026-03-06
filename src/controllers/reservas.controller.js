import * as reservaModel from '../models/reservas.model.js';

export const getReservas = async (req, res) => {
  try {
    const reservas = await reservaModel.getAllReservas();
    
    res.status(200).json(reservas); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReservaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    
    const salon = await reservaModel.getReservaById(id);

    if(!salon) return res.status(400).json({msg: "Reserva no encontrado"});
    res.status(200).json(salon); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReservaClient = async (req, res) => {
  try {
    const id = req.user.id;
    
    const salon = await reservaModel.getReservaClient(id);

    if(!salon) return res.status(400).json({msg: "Reserva no encontrado"});
    res.status(200).json(salon); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReservaClientbyID = async (req, res) => {
  try {
    const id_cliente = req.user.id;
    const { id_reserva } = req.params;
    if (isNaN(id_reserva)) return res.status(400).json({ msg: "El ID de reserva debe ser un número válido" });

    const salon = await reservaModel.getReservaClientbyID(id_cliente, id_reserva);

    if(!salon) return res.status(404).json({msg: "Reserva no encontrado"});
    res.status(200).json(salon); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reservaOcupada = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    if (!data.id_salon || !data.fecha || !data.hora_inicio || !data.hora_fin)
        return res.status(400).json({msg: "Faltan datos obligatorios"});
    const ocupada = await reservaModel.fechaOcupada(id, data);
        res.status(200).json({ ocupada }); // Enviar como objeto JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPresupuesto = async (req, res) => {
  try {
    const { id_sala, id_servicio } = req.body;
    if (isNaN(id_sala) || isNaN(id_servicio)) return res.status(400).json({ msg: "Los IDs deben ser números válidos" });
    const total_calculado = await reservaModel.obtenerPresupuesto(id_sala, id_servicio);
    res.status(200).json({ total_calculado }); // Enviar como objeto JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReservaClient = async (req, res) => {
  try {
    // Validación
    const id = req.user.id;
    const data = req.body;
    if (!id||!data.id_salon || !data.fecha || !data.hora_inicio || !data.hora_fin || !data.id_servicio)
      return res.status(400).json({msg: "Faltan datos obligatorios"});
    
    const nuevo = await reservaModel.createReserva(data);
    res.status(201).json(nuevo); // Created
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReserva = async (req, res) => {
  try {
    // Validación
    const data = req.body;
    if (!data.id_cliente ||!data.id_salon || !data.fecha || !data.hora_inicio || !data.hora_fin || !data.id_servicio)
      return res.status(400).json({msg: "Faltan datos obligatorios"});
    
    const nuevo = await reservaModel.createReserva(data);
    res.status(201).json(nuevo); // Created
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const alterReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userSession = req.user; // Información del usuario autenticado
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    if (!data.id_cliente ||!data.id_salon || !data.fecha || !data.hora_inicio || !data.hora_fin || !data.id_servicio)
      return res.status(400).json({msg: "Faltan datos obligatorios"});

    const actualizado = await reservaModel.alterReserva(id, data, userSession);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const disableReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const userSession = req.user; // Información del usuario autenticado
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });

    const actualizado = await reservaModel.cancelReserva(id, userSession);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enableReserva = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });

    const actualizado = await reservaModel.confirmarReserva(id);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};