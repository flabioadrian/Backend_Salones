import * as salonModel from '../models/salones.model.js';

export const getSalones = async (req, res) => {
  try {
    const salones = await salonModel.getSalonesActivos();
    
    res.status(200).json(salones); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSalones = async (req, res) => {
  try {
    const salones = await salonModel.getAllSalones();
    
    res.status(200).json(salones); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSalonById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = req.user;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    
    const salon = await salonModel.getSalonById(id, session);

    if(!salon) return res.status(400).json({msg: "Salon no encontrado"});
    res.status(200).json(salon); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSalon = async (req, res) => {
  try {
    // Validación
    const data = req.body;
    if (!data.nombre ||!data.capacidad || !data.precio || !data.imagenUrl || !data.descripcion)
      return res.status(400).json({msg: "Faltan datos obligatorios"});
    
    const nuevo = await salonModel.createSalon(data);
    res.status(201).json(nuevo); // Created
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const alterSalon = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    if (!data.nombre ||!data.capacidad || !data.precio || !data.imagenUrl || !data.descripcion)
      return res.status(400).json({msg: "Faltan datos obligatorios"});

    const actualizado = await salonModel.alterSalon(id, data);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const disableSalon = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });

    const actualizado = await salonModel.disableSalon(id);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enableSalon = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });

    const actualizado = await salonModel.enableSalon(id);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};