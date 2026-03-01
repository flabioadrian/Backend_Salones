import * as servicioModel from '../models/servicios.model.js';

export const getServicios = async (req, res) => {
  try {
    const servicios = await servicioModel.getAllServicios();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServicioById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    
    const servicio = await servicioModel.getServicioById(id);

    if(!servicio) return res.status(400).json({msg: "Servicio no encontrado"});
    res.status(200).json(servicio); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createServicio = async (req, res) => {
  try {
    const data = req.body;
    if (!data.nombre || !data.costo || !data.descripcion) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }
    const nuevo = await servicioModel.createServicio(data);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const alterServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    if (!data.nombre || !data.costo || !data.descripcion)
      return res.status(400).json({msg: "Faltan datos obligatorios"});

    const actualizado = await servicioModel.alterServicio(id, data);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const disableServicio = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });

    const actualizado = await servicioModel.disableServicio(id);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enableServicio = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });

    const actualizado = await servicioModel.enableServicio(id);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};