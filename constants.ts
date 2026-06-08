import type { PropertyType, Condition, Intent, Timeframe, Orientation } from './types';

export const COMPANY_NAME = (typeof process !== 'undefined' && (process as any).env?.COMPANY_NAME) || 'Tasador IA';
export const COMPANY_EMAIL = (typeof process !== 'undefined' && (process as any).env?.COMPANY_EMAIL) || 'hola@tasador-ia.example';
export const LEAD_WEBHOOK_URL: string = (typeof process !== 'undefined' && (process as any).env?.LEAD_WEBHOOK_URL) || '';
export const GEMINI_API_KEY: string = (typeof process !== 'undefined' && (process as any).env?.API_KEY) || '';

export const PROPERTY_TYPES: { value: PropertyType; label: string; icon: string; description: string }[] = [
  { value: 'piso', label: 'Piso', icon: 'Building2', description: 'Vivienda en bloque o edificio' },
  { value: 'atico', label: 'Ático', icon: 'Building', description: 'Última planta con terraza' },
  { value: 'duplex', label: 'Dúplex', icon: 'Layers', description: 'Dos plantas conectadas' },
  { value: 'estudio', label: 'Estudio', icon: 'Square', description: 'Espacio diáfano sin dormitorio separado' },
  { value: 'casa_adosada', label: 'Casa adosada', icon: 'Home', description: 'Casa unida a otra vivienda' },
  { value: 'chalet', label: 'Chalet independiente', icon: 'TreePine', description: 'Vivienda aislada con parcela' },
  { value: 'casa_rural', label: 'Casa rural', icon: 'Mountain', description: 'Vivienda fuera de núcleo urbano' },
];

export const CONDITIONS: { value: Condition; label: string; description: string }[] = [
  { value: 'a_reformar', label: 'A reformar', description: 'Necesita reforma integral o trabajos importantes' },
  { value: 'buen_estado', label: 'Buen estado', description: 'Habitable sin obras, con cierto desgaste' },
  { value: 'reformado', label: 'Reformado', description: 'Reforma reciente, listo para entrar a vivir' },
  { value: 'obra_nueva', label: 'Obra nueva', description: 'Promoción nueva o entregada hace menos de 5 años' },
];

export const INTENTS: { value: Intent; label: string; description: string }[] = [
  { value: 'vender', label: 'Vender mi vivienda', description: 'Quiero ponerla en el mercado' },
  { value: 'comprar_otra', label: 'Vender para comprar otra', description: 'Voy a cambiar de vivienda' },
  { value: 'refinanciar', label: 'Refinanciar hipoteca', description: 'Necesito conocer el valor actualizado' },
  { value: 'herencia', label: 'Herencia o trámite legal', description: 'Necesito una valoración orientativa' },
  { value: 'curiosidad', label: 'Solo curiosidad', description: 'Quiero saber cuánto vale hoy' },
];

export const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: 'inmediato', label: 'Lo antes posible' },
  { value: '1_3_meses', label: 'En 1-3 meses' },
  { value: '3_6_meses', label: 'En 3-6 meses' },
  { value: '6_12_meses', label: 'En 6-12 meses' },
  { value: 'sin_urgencia', label: 'Sin urgencia' },
];

export const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: 'sur', label: 'Sur' },
  { value: 'este', label: 'Este' },
  { value: 'oeste', label: 'Oeste' },
  { value: 'norte', label: 'Norte' },
  { value: 'no_se', label: 'No lo sé' },
];

// Precio medio €/m² de OFERTA residencial de SEGUNDA MANO por provincia.
// Referencia: índices públicos del mercado español 2025 (Idealista / Fotocasa / Tinsa, orden de magnitud).
// Estos valores son orientativos y deben revisarse periódicamente.
export const PROVINCE_PRICE_PER_SQM: Record<string, number> = {
  'Álava': 2500,
  'Albacete': 1200,
  'Alicante': 2200,
  'Almería': 1600,
  'Asturias': 1700,
  'Ávila': 1150,
  'Badajoz': 1100,
  'Barcelona': 4600,
  'Bizkaia': 3000,
  'Burgos': 1600,
  'Cáceres': 1150,
  'Cádiz': 2100,
  'Cantabria': 2100,
  'Castellón': 1500,
  'Ceuta': 2100,
  'Ciudad Real': 1050,
  'Córdoba': 1450,
  'Cuenca': 1050,
  'Gipuzkoa': 4000,
  'Girona': 2800,
  'Granada': 1700,
  'Guadalajara': 1600,
  'Huelva': 1500,
  'Huesca': 1550,
  'Illes Balears': 4500,
  'Jaén': 1050,
  'La Coruña': 1900,
  'La Rioja': 1700,
  'Las Palmas': 2500,
  'León': 1350,
  'Lleida': 1500,
  'Lugo': 1250,
  'Madrid': 4800,
  'Málaga': 3500,
  'Melilla': 1900,
  'Murcia': 1500,
  'Navarra': 2100,
  'Ourense': 1250,
  'Palencia': 1250,
  'Pontevedra': 1800,
  'Salamanca': 1700,
  'Santa Cruz de Tenerife': 2400,
  'Segovia': 1700,
  'Sevilla': 2100,
  'Soria': 1250,
  'Tarragona': 1900,
  'Teruel': 1050,
  'Toledo': 1250,
  'Valencia': 2400,
  'Valladolid': 1800,
  'Zamora': 1100,
  'Zaragoza': 1900,
};

export const PROVINCES = Object.keys(PROVINCE_PRICE_PER_SQM).sort((a, b) => a.localeCompare(b, 'es'));

export const DEFAULT_PRICE_PER_SQM = 1800;

export const TYPE_MULTIPLIER: Record<PropertyType, number> = {
  piso: 1.0,
  atico: 1.15,
  duplex: 1.08,
  estudio: 0.92,
  casa_adosada: 1.08,
  chalet: 1.2,
  casa_rural: 0.8,
};

export const CONDITION_MULTIPLIER: Record<Condition, number> = {
  a_reformar: 0.75,
  buen_estado: 1.0,
  reformado: 1.15,
  obra_nueva: 1.3,
};

export const EXTRAS_IMPACT: Record<keyof import('./types').Extras, number> = {
  ascensor: 0.04,
  parking: 0.06,
  trastero: 0.015,
  terraza: 0.04,
  balcon: 0.015,
  jardin: 0.06,
  piscina: 0.06,
  aireAcondicionado: 0.025,
  calefaccion: 0.025,
};
