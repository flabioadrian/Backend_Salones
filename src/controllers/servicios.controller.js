import * as alumnoModel from '../models/servicios.model.js';

export const getServicios = async (req, res) => {
  try {
    const alumnos = await alumnoModel.getAllServicios();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createServicio = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.costo || !req.body.descripcion) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }
    const nuevo = await alumnoModel.createServicio(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};