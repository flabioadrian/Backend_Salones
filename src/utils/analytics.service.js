
/*
const ajustarExponencial = (data) => {
  const n = data.length;
  const puntos = data.map((item, idx) => ({ t: idx, y: item.cantidad_reservas }));

  const lnY = puntos.map(p => Math.log(p.y || 1));
  const sumT = puntos.reduce((s, p) => s + p.t, 0);
  const sumLnY = lnY.reduce((s, v) => s + v, 0);
  const sumT2 = puntos.reduce((s, p) => s + p.t * p.t, 0);
  const sumTLnY = puntos.reduce((s, p, i) => s + p.t * lnY[i], 0);

  const denominador = n * sumT2 - sumT * sumT;
  const k = (n * sumTLnY - sumT * sumLnY) / denominador;
  const lnA = (sumLnY - k * sumT) / n;
  const a = Math.exp(lnA);

  // Cálculo de R²
  const yHat = puntos.map(p => a * Math.exp(k * p.t));
  const yMean = puntos.reduce((s, p) => s + p.y, 0) / n;
  const ssRes = puntos.reduce((s, p, i) => s + (p.y - yHat[i]) ** 2, 0);
  const ssTot = puntos.reduce((s, p) => s + (p.y - yMean) ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  // Proyección
  const proyecciones = [];
  for (let i = 1; i <= 6; i++) {
    const tFuturo = (n - 1) + i;
    const yPred = a * Math.exp(k * tFuturo);
    proyecciones.push({
      mes_offset: i,
      cantidad_estimada: Math.round(yPred),
    });
  }

  return { k, a, r2, proyecciones };
};
*/

const ajustarExponencial = (data) => {
  const n = data.length;
  if (n < 2) {
    throw new Error('Se necesitan al menos 2 puntos para el ajuste exponencial');
  }

  // Primer y último punto
  const yFirst = data[0].cantidad_reservas;
  const yLast  = data[n - 1].cantidad_reservas;
  
  // Evitar log(<=0)
  const safeYFirst = Math.max(yFirst, 1e-6);
  const safeYLast  = Math.max(yLast, 1e-6);
  
  // Tiempo total = n-1
  const tLast = n - 1;
  
  // k = ln(y_last / y_first) / tLast
  const k = Math.log(safeYLast / safeYFirst) / tLast;
  // a = y_first (valor inicial en t=0)
  const a = safeYFirst;
  
  // Predicciones para todos los puntos (para calcular R²)
  const yHat = data.map((_, idx) => a * Math.exp(k * idx));
  
  // Cálculo de R² usando todos los puntos reales vs predicciones
  const yActual = data.map(p => p.cantidad_reservas);
  const yMean = yActual.reduce((s, y) => s + y, 0) / n;
  const ssRes = yActual.reduce((s, y, i) => s + (y - yHat[i]) ** 2, 0);
  const ssTot = yActual.reduce((s, y) => s + (y - yMean) ** 2, 0);
  const r2 = 1 - ssRes / ssTot;
  
  // Proyección a 6 meses futuros
  const proyecciones = [];
  for (let i = 1; i <= 6; i++) {
    const tFuturo = (n - 1) + i;
    const yPred = a * Math.exp(k * tFuturo);
    proyecciones.push({
      mes_offset: i,
      cantidad_estimada: Math.round(yPred),
    });
  }
  
  return { k, a, r2, proyecciones };
};

export const procesarAnalisisReservas = (dataRaw) => {
  // 1. Limpieza/Transformación básica
  const datosModelo = dataRaw.map(item => ({
    mes: item.mes,
    cantidad_reservas: item.cantidad_reservas,
    total_ingresos: parseFloat(item.total_ingresos)
  }));

  // 2. Ejecutar cálculos matemáticos
  const { k, a, r2, proyecciones } = ajustarExponencial(datosModelo);

  // 3. Clasificar temporadas
  const maxReservas = Math.max(...datosModelo.map(m => m.cantidad_reservas));
  const minReservas = Math.min(...datosModelo.map(m => m.cantidad_reservas));

  const temporadas = datosModelo.map(item => {
    let tipo = 'media';
    if (item.cantidad_reservas > maxReservas * 0.8) tipo = 'alta';
    else if (item.cantidad_reservas < minReservas * 1.2) tipo = 'baja';
    return { ...item, tipo };
  });

  // 4. Retornar todo el paquete de información
  return {
    tasa_crecimiento_k: k,
    coeficiente_a: a,
    r2,
    interpretacion: k > 0 ? 'Crecimiento general' : (k < 0 ? 'Decrecimiento general' : 'Estable'),
    temporadas,
    proyecciones
  };
};