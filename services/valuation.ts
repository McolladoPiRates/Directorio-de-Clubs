import { GoogleGenAI, Type } from '@google/genai';
import {
  CONDITION_MULTIPLIER,
  DEFAULT_PRICE_PER_SQM,
  EXTRAS_IMPACT,
  GEMINI_API_KEY,
  PROVINCE_PRICE_PER_SQM,
  TYPE_MULTIPLIER,
} from '../constants';
import type {
  Extras,
  GroundingSource,
  ValuationBreakdownItem,
  ValuationFormData,
  ValuationResult,
} from '../types';
import { formatNumber } from '../utils';

const PROPERTY_TYPE_LABELS: Record<NonNullable<ValuationFormData['tipo']>, string> = {
  piso: 'piso',
  atico: 'ático',
  duplex: 'dúplex',
  estudio: 'estudio',
  casa_adosada: 'casa adosada',
  chalet: 'chalet',
  casa_rural: 'casa rural',
};

const CONDITION_LABELS: Record<NonNullable<ValuationFormData['estado']>, string> = {
  a_reformar: 'a reformar',
  buen_estado: 'en buen estado',
  reformado: 'reformado',
  obra_nueva: 'obra nueva',
};

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

// --- Grounding: búsqueda de precios reales en portales inmobiliarios -------

interface GroundingFindings {
  context: string;
  sources: GroundingSource[];
}

const buildSearchPrompt = (form: ValuationFormData): string => {
  const tipo = form.tipo ? PROPERTY_TYPE_LABELS[form.tipo] : 'vivienda';
  const estado = form.estado ? CONDITION_LABELS[form.estado] : 'estado estándar';
  const ubic = [form.direccion.ciudad, form.direccion.codigoPostal, form.direccion.provincia]
    .filter(Boolean)
    .join(', ');
  const m2 = form.metrosConstruidos || form.metrosUtiles || 'desconocido';
  const dorm = form.dormitorios ?? 'n/d';

  return `Eres un analista del mercado inmobiliario español. Busca en portales inmobiliarios públicos
(Idealista, Fotocasa, Habitaclia, Pisos.com, Servihabitat, así como notas de prensa de Tinsa,
Sociedad de Tasación o el INE) datos ACTUALES de precios para la siguiente vivienda:

- Tipo: ${tipo}
- Ubicación: ${ubic || 'no especificada'}
- Superficie aproximada: ${m2} m²
- Dormitorios: ${dorm}
- Estado: ${estado}

Quiero que devuelvas, en TEXTO PLANO (no JSON), la siguiente información:

1. Rango €/m² observado en anuncios actuales para ese tipo de vivienda y esa ubicación
   (mínimo, mediana y máximo).
2. 3-5 anuncios comparables (precio total, m², €/m², estado, fuente) sin URLs largas.
3. Tendencia reciente (últimos 6-12 meses) si aparece en notas de Tinsa / Idealista / INE.
4. Comentario breve sobre la zona o barrio.

REGLAS ESTRICTAS:
- Usa SOLO datos que encuentres realmente en la búsqueda. NO inventes números.
- Si no encuentras datos para la ciudad concreta, baja al municipio/provincia y dilo explícitamente.
- Sé prudente: rangos, no precios exactos por anuncio.
- No incluyas datos personales de vendedores ni URLs completas.`;
};

const fetchMarketGrounding = async (
  ai: GoogleGenAI,
  form: ValuationFormData,
): Promise<GroundingFindings | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildSearchPrompt(form),
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const text = response.text?.trim();
    if (!text) return null;

    const meta = response.candidates?.[0]?.groundingMetadata;
    const chunks = (meta as any)?.groundingChunks ?? [];
    const sources: GroundingSource[] = [];
    const seen = new Set<string>();
    for (const c of chunks) {
      const web = c?.web;
      if (!web?.uri) continue;
      const uri = web.uri as string;
      if (seen.has(uri)) continue;
      seen.add(uri);
      sources.push({ title: (web.title as string) || uri, uri });
      if (sources.length >= 6) break;
    }

    return { context: text, sources };
  } catch (err) {
    console.warn('[valuation] Grounding search failed:', err);
    return null;
  }
};

// --- Refinamiento estructurado ---------------------------------------------

const valuationResponseSchema = {
  type: Type.OBJECT,
  properties: {
    adjustmentPct: {
      type: Type.NUMBER,
      description: 'Ajuste porcentual sobre el valor central heurístico, entre -15 y 15.',
    },
    confidence: {
      type: Type.STRING,
      enum: ['baja', 'media', 'alta'],
    },
    marketSummary: {
      type: Type.STRING,
      description: 'Resumen de 2-3 frases sobre el mercado local y el rango. En español.',
    },
    sellingTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Entre 3 y 5 consejos accionables. En español.',
    },
  },
  required: ['adjustmentPct', 'confidence', 'marketSummary', 'sellingTips'],
};

interface RefinementInput {
  adj: number;
  conf: 'baja' | 'media' | 'alta';
  summary: string;
  tips: string[];
}

const callRefinement = async (
  ai: GoogleGenAI,
  form: ValuationFormData,
  base: ValuationResult,
  marketContext: string | null,
): Promise<RefinementInput | null> => {
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

  const groundingBlock = marketContext
    ? `\n\nCONTEXTO DE MERCADO REAL (extraído mediante búsqueda en portales inmobiliarios):
"""
${marketContext}
"""
Usa este contexto como anclaje principal. Si la heurística está claramente desalineada con los anuncios
comparables, corrige el adjustmentPct en consecuencia (rango permitido: -15% a +15%). Si el contexto NO
contiene datos suficientes, sé prudente y mantén un ajuste pequeño.`
    : '\n\nNo se ha podido obtener contexto de mercado real. Usa solo la heurística y conocimiento general.';

  const prompt = `Eres un analista del mercado inmobiliario español. Recibes los datos de una vivienda,
una valoración heurística inicial y, posiblemente, un contexto de mercado obtenido por búsqueda real.

Tu tarea:
1. Sugerir un ajuste porcentual (entre -15% y +15%) sobre el valor central heurístico.
2. Indicar nivel de confianza (baja/media/alta). Sube la confianza si el contexto real está disponible y es coherente.
3. Redactar un resumen de 2-3 frases en español, sintetizando el contexto real cuando exista (sin citar URLs).
4. Generar 3-5 consejos accionables para el propietario.

IMPORTANTE:
- No inventes calles ni anuncios concretos.
- No menciones marcas comerciales explícitamente.
- No sustituyas el trabajo de un tasador homologado.

Datos de la vivienda y heurística:
${JSON.stringify(context, null, 2)}${groundingBlock}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: valuationResponseSchema,
        temperature: 0.3,
      },
    });

    const text = response.text?.trim();
    if (!text) return null;

    const parsed = JSON.parse(text) as {
      adjustmentPct: number;
      confidence: 'baja' | 'media' | 'alta';
      marketSummary: string;
      sellingTips: string[];
    };

    return {
      adj: Math.max(-15, Math.min(15, Number(parsed.adjustmentPct) || 0)),
      conf: parsed.confidence || base.confidence,
      summary: parsed.marketSummary || base.marketSummary,
      tips:
        Array.isArray(parsed.sellingTips) && parsed.sellingTips.length > 0
          ? parsed.sellingTips.slice(0, 5)
          : base.sellingTips,
    };
  } catch (err) {
    console.warn('[valuation] Refinement call failed:', err);
    return null;
  }
};

export const refineValuationWithGemini = async (
  form: ValuationFormData,
  base: ValuationResult,
): Promise<ValuationResult> => {
  if (!GEMINI_API_KEY) return base;

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const grounded = await fetchMarketGrounding(ai, form);
  const refined = await callRefinement(ai, form, base, grounded?.context ?? null);
  if (!refined) {
    if (grounded) {
      return {
        ...base,
        source: 'grounded',
        marketSummary: base.marketSummary,
        groundingSources: grounded.sources,
        marketContext: grounded.context,
      };
    }
    return base;
  }

  const central = Math.round((base.centralEur * (1 + refined.adj / 100)) / 100) * 100;
  const min = Math.round((central * 0.93) / 100) * 100;
  const max = Math.round((central * 1.12) / 100) * 100;

  return {
    ...base,
    centralEur: central,
    minEur: min,
    maxEur: max,
    pricePerSqmEur: Math.round(base.pricePerSqmEur * (1 + refined.adj / 100)),
    confidence: refined.conf,
    source: grounded && grounded.sources.length > 0 ? 'grounded' : 'gemini',
    marketSummary: refined.summary,
    sellingTips: refined.tips,
    groundingSources: grounded?.sources,
    marketContext: grounded?.context,
  };
};

export const computeValuation = async (form: ValuationFormData): Promise<ValuationResult> => {
  const base = computeHeuristicValuation(form);
  return refineValuationWithGemini(form, base);
};
