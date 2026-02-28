import * as grupoModel from '../models/salones.model.js';

export const getGrupos = async (req, res) => {
  try {
    const grupos = await grupoModel.getAllSalones();
    res.status(200).json(grupos); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createGrupo = async (req, res) => {
  try {
    // Validación
    if (!req.body.nombre_grupo) return res.status(400).json({msg: "Falta nombre"});
    
    const nuevo = await grupoModel.createGrupo(req.body);
    res.status(201).json(nuevo); // Created
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};