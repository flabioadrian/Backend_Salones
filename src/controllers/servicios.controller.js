import * as alumnoModel from '../models/servicios.model.js';

export const getServicios = async (req, res) => {
  try {
    const alumnos = await alumnoModel.getAllServicios();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAlumno = async (req, res) => {
  try {
    if (!req.body.matricula || !req.body.nombre) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }
    const nuevo = await alumnoModel.createAlumno(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};