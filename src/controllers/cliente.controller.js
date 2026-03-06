import * as clienteModel from '../models/cliente.model.js';

export const getClientes = async (req, res) => {
  try {
    const clientes = await clienteModel.getAllClientes();
    
    res.status(200).json(clientes); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    
    const clientes = await clienteModel.getClienteById(id);

    if(!clientes) return res.status(400).json({msg: "Cliente no encontrado"});
    res.status(200).json(clientes); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInfoClient = async (req, res) => {
  try {
    const id = req.user.id;
    
    const clientes = await clienteModel.getClienteById(id);

    if(!clientes) return res.status(400).json({msg: "Cliente no encontrado"});
    res.status(200).json(clientes); // Éxito
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCliente = async (req, res) => {
  try {
    // Validación
    const data = req.body;
    if (!data.nombre || !data.aPaterno || !data.aMaterno || !data.telefono || !data.email || !data.password)
      return res.status(400).json({msg: "Faltan datos obligatorios"});
    
    const nuevo = await clienteModel.createCliente(data);
    res.status(201).json(nuevo); // Created
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const alterCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    if (!data.nombre || !data.aPaterno || !data.aMaterno || !data.telefono || !data.email || !data.password )
      return res.status(400).json({msg: "Faltan datos obligatorios"});

    const actualizado = await clienteModel.alterCliente(id, data);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const alterInfoCliente = async (req, res) => {
  try {
    const id = req.user.id;
    const data = req.body;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });
    if (!data.nombre || !data.aPaterno || !data.aMaterno || !data.telefono || !data.email || !data.password )
      return res.status(400).json({msg: "Faltan datos obligatorios"});

    const actualizado = await clienteModel.alterCliente(id, data);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const disableCliente = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });

    const actualizado = await clienteModel.disableCliente(id);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enableCliente = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ msg: "El ID debe ser un número válido" });

    const actualizado = await clienteModel.enableCliente(id);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};