import { GoogleGenAI, Type } from '@google/genai';
import {
  CONDITION_MULTIPLIER,
  DEFAULT_PRICE_PER_SQM,
  EXTRAS_IMPACT,
  GEMINI_API_KEY,
  PROVINCE_PRICE_PER_SQM,
  TYPE_MULTIPLIER,
} from '../constants';
import type { Extras, ValuationFormData, ValuationResult, ValuationBreakdownItem } from '../types';
import { formatNumber } from '../utils';

const yearMultiplier = (year: number | null): number => {
  if (!year) return 1.0;
  if (year < 1950) return 0.92;
  if (year < 1980) return 0.96;
  if (year < 2000) return 1.0;
  if (year < 2010) return 1.05;
  return 1.1;
};

const floorMultiplier = (planta: number | null): number => {
  if (planta === null || planta === undefined) return 1.0;
  if (planta <= 0) return 0.95;
  if (planta <= 3) return 1.0;
  if (planta <= 6) return 1.03;
  return 1.06;
};

const orientationMultiplier = (o: ValuationFormData['orientacion']): number => {
  switch (o) {
    case 'sur':
      return 1.04;
    case 'este':
    case 'oeste':
      return 1.015;
    default:
      return 1.0;
  }
};

const sumExtras = (extras: Extras): number =>
  (Object.keys(EXTRAS_IMPACT) as (keyof Extras)[]).reduce(
    (acc, key) => acc + (extras[key] ? EXTRAS_IMPACT[key] : 0),
    0,
  );

export const computeHeuristicValuation = (form: ValuationFormData): ValuationResult => {
  const m2 = form.metrosConstruidos || form.metrosUtiles || 0;
  const basePricePerSqm = PROVINCE_PRICE_PER_SQM[form.direccion.provincia] || DEFAULT_PRICE_PER_SQM;

  const typeMult = form.tipo ? TYPE_MULTIPLIER[form.tipo] : 1.0;
  const condMult = form.estado ? CONDITION_MULTIPLIER[form.estado] : 1.0;
  const yearMult = yearMultiplier(form.anoConstruccion);
  const floorMult = floorMultiplier(form.planta);
  const orientMult = orientationMultiplier(form.orientacion);
  const extrasPct = sumExtras(form.extras);

  const adjustedPricePerSqm =
    basePricePerSqm * typeMult * condMult * yearMult * floorMult * orientMult * (1 + extrasPct);

  const central = Math.max(0, Math.round((m2 * adjustedPricePerSqm) / 100) * 100);
  const min = Math.round((central * 0.93) / 100) * 100;
  const max = Math.round((central * 1.12) / 100) * 100;

  const breakdown: ValuationBreakdownItem[] = [
    { label: 'Precio medio en la zona', impactPct: 0, detail: `${formatNumber(Math.round(basePricePerSqm))} €/m² en ${form.direccion.provincia || 'tu provincia'}` },
    { label: 'Tipo de vivienda', impactPct: (typeMult - 1) * 100 },
    { label: 'Estado de conservación', impactPct: (condMult - 1) * 100 },
    { label: 'Antigüedad', impactPct: (yearMult - 1) * 100 },
    { label: 'Planta', impactPct: (floorMult - 1) * 100 },
    { label: 'Orientación', impactPct: (orientMult - 1) * 100 },
    { label: 'Extras y calidades', impactPct: extrasPct * 100 },
  ].filter((b) => b.label === 'Precio medio en la zona' || Math.abs(b.impactPct) > 0.5);

  const tips: string[] = [];
  if (form.estado === 'a_reformar') {
    tips.push('Una reforma básica de cocina y baños puede aumentar el valor de venta entre un 8% y un 15%.');
  }
  if (!form.extras.aireAcondicionado) {
    tips.push('Instalar aire acondicionado mejora la percepción del comprador y reduce el tiempo en mercado.');
  }
  if (form.intencion === 'vender') {
    tips.push('Publicar el inmueble en varios portales y trabajar con varias inmobiliarias suele acelerar la venta.');
  }
  tips.push('Solicita al menos tres tasaciones presenciales antes de fijar precio de salida.');

  return {
    centralEur: central,
    minEur: min,
    maxEur: max,
    pricePerSqmEur: Math.round(adjustedPricePerSqm),
    confidence: m2 && form.direccion.provincia ? 'media' : 'baja',
    source: 'heuristic',
    marketSummary:
      'Estimación calculada a partir del precio medio €/m² de la provincia y ajustada por las características declaradas. Sirve como orientación inicial.',
    sellingTips: tips.slice(0, 4),
    breakdown,
  };
};

const valuationResponseSchema = {
  type: Type.OBJECT,
  properties: {
    adjustmentPct: {
      type: Type.NUMBER,
      description: 'Ajuste porcentual sobre el valor central heurístico, entre -10 y 10.',
    },
    confidence: {
      type: Type.STRING,
      enum: ['baja', 'media', 'alta'],
    },
    marketSummary: {
      type: Type.STRING,
      description: 'Resumen de 2-3 frases sobre el mercado local y por qué la vivienda se sitúa en ese rango. En español.',
    },
    sellingTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Entre 3 y 5 consejos prácticos y accionables para vender mejor. En español.',
    },
  },
  required: ['adjustmentPct', 'confidence', 'marketSummary', 'sellingTips'],
};

export const refineValuationWithGemini = async (
  form: ValuationFormData,
  base: ValuationResult,
): Promise<ValuationResult> => {
  if (!GEMINI_API_KEY) return base;

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const context = {
      tipo: form.tipo,
      ubicacion: {
        ciudad: form.direccion.ciudad,
        provincia: form.direccion.provincia,
        codigoPostal: form.direccion.codigoPostal,
      },
      superficie: {
        construidos: form.metrosConstruidos,
        utiles: form.metrosUtiles,
      },
      distribucion: {
        dormitorios: form.dormitorios,
        banos: form.banos,
      },
      anoConstruccion: form.anoConstruccion,
      planta: form.planta,
      orientacion: form.orientacion,
      estado: form.estado,
      extras: form.extras,
      intencion: form.intencion,
      plazo: form.plazo,
      heuristica: {
        valorCentralEur: base.centralEur,
        rangoEur: [base.minEur, base.maxEur],
        precioPorM2Eur: base.pricePerSqmEur,
      },
    };

    const prompt = `Eres un analista del mercado inmobiliario español. Recibes los datos de una vivienda y una valoración heurística inicial.

Tu tarea:
1. Sugerir un ajuste porcentual (entre -10% y +10%) sobre el valor central heurístico, basándote en el tipo de vivienda, ubicación, estado, extras y dinámica típica del mercado español.
2. Indicar el nivel de confianza (baja/media/alta) en función de cuántos datos clave faltan o son inusuales.
3. Redactar un resumen de 2-3 frases en español neutro explicando el rango.
4. Generar entre 3 y 5 consejos accionables para que el propietario obtenga mejor precio.

IMPORTANTE: NO inventes datos concretos de barrios o calles. NO menciones marcas comerciales. NO sustituyas el trabajo de un tasador homologado. Mantén un tono profesional y prudente.

Datos de entrada:
${JSON.stringify(context, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: valuationResponseSchema,
        temperature: 0.4,
      },
    });

    const text = response.text?.trim();
    if (!text) return base;

    const parsed = JSON.parse(text) as {
      adjustmentPct: number;
      confidence: 'baja' | 'media' | 'alta';
      marketSummary: string;
      sellingTips: string[];
    };

    const adj = Math.max(-10, Math.min(10, Number(parsed.adjustmentPct) || 0));
    const central = Math.round((base.centralEur * (1 + adj / 100)) / 100) * 100;
    const min = Math.round((central * 0.93) / 100) * 100;
    const max = Math.round((central * 1.12) / 100) * 100;

    return {
      ...base,
      centralEur: central,
      minEur: min,
      maxEur: max,
      pricePerSqmEur: Math.round(base.pricePerSqmEur * (1 + adj / 100)),
      confidence: parsed.confidence || base.confidence,
      source: 'gemini',
      marketSummary: parsed.marketSummary || base.marketSummary,
      sellingTips: Array.isArray(parsed.sellingTips) && parsed.sellingTips.length > 0 ? parsed.sellingTips.slice(0, 5) : base.sellingTips,
    };
  } catch (err) {
    console.warn('[valuation] Gemini refinement failed, using heuristic.', err);
    return base;
  }
};

export const computeValuation = async (form: ValuationFormData): Promise<ValuationResult> => {
  const base = computeHeuristicValuation(form);
  return refineValuationWithGemini(form, base);
};
