// controllers/admin.controller.js
import * as adminModel from '../models/admin.model.js';
import bcrypt from 'bcrypt';

// SELECT - Obtener todos los administradores
export const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SELECT - Obtener administrador por ID
export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    
    const admin = await adminModel.getAdminById(id);
    if (!admin) return res.status(404).json({ msg: "Administrador no encontrado" });
    
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Actualizar administrador
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    
    // Validar que haya al menos un campo para actualizar
    if (!data.nombre && !data.aPaterno && !data.aMaterno && !data.email && !data.password) {
      return res.status(400).json({ msg: "No hay datos para actualizar" });
    }
    
    // Si viene password, encriptarlo
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    
    const actualizado = await adminModel.updateAdmin(id, data);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
