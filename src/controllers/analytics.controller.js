import * as analyticsModel from '../models/analytics.model.js';
import * as analyticsService from '../utils/analytics.service.js';

export const getAnalisisTemporadas = async (req, res) => {
  try {
    const { anio_inicio = 2025, anio_fin = 2025 } = req.query;
    const dataPorMes = await analyticsModel.getReservasPorMes(anio_inicio, anio_fin);
    if (dataPorMes.length < 2) {
      return res.status(400).json({ msg: 'No hay suficientes datos.' });
    }
    const analisis = analyticsService.procesarAnalisisReservas(dataPorMes);
    res.status(200).json({
      periodo: `${anio_inicio} - ${anio_fin}`,
      ...analisis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};