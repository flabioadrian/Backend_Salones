
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

  // 1. Definir 'a' como el primer punto (mes 1, t=0)
  const a = Math.max(data[0].cantidad_reservas, 1e-6);

  // 2. Calcular la suma y el promedio de 'y' (reservas)
  const sumaY = data.reduce((s, p) => s + p.cantidad_reservas, 0);
  const promedioY = sumaY / n;

  // 3. Calcular el promedio de 't' (tiempos)
  // Si los meses son 0, 1, 2... n-1, la suma es (n-1)*n / 2
  const sumaT = data.reduce((s, _, idx) => s + idx, 0);
  const promedioT = sumaT / n; 

  // 4. Calcular k usando los promedios
  // k = ln(promedioY / a) / promedioT
  const safePromedioY = Math.max(promedioY, 1e-6);
  const k = Math.log(safePromedioY / a) / promedioT;

  // 5. Predicciones para R²
  const yHat = data.map((_, idx) => a * Math.exp(k * idx));
  const yActual = data.map(p => p.cantidad_reservas);
  const yMean = sumaY / n;
  
  const ssRes = yActual.reduce((s, y, i) => s + (y - yHat[i]) ** 2, 0);
  const ssTot = yActual.reduce((s, y) => s + (y - yMean) ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  // 6. Proyección a futuro (Enero y Febrero 2025)
  // Si n=12 (meses de 2024), t=12 es Enero y t=13 es Febrero
  const proyecciones = [];
  for (let i = 0; i < 2; i++) {
    const tFuturo = n + i; 
    const yPred = a * Math.exp(k * tFuturo);
    proyecciones.push({
      mes_offset: i + 1,
      t_valor: tFuturo,
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