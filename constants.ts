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

// Precio medio €/m² residencial por provincia (aprox. mercado español 2024-2025).
// Fuente orientativa, NO usar como tasación oficial.
export const PROVINCE_PRICE_PER_SQM: Record<string, number> = {
  'Álava': 2300,
  'Albacete': 1100,
  'Alicante': 1900,
  'Almería': 1400,
  'Asturias': 1500,
  'Ávila': 1000,
  'Badajoz': 1000,
  'Barcelona': 4200,
  'Bizkaia': 2700,
  'Burgos': 1400,
  'Cáceres': 1000,
  'Cádiz': 1800,
  'Cantabria': 1900,
  'Castellón': 1300,
  'Ceuta': 2000,
  'Ciudad Real': 950,
  'Córdoba': 1300,
  'Cuenca': 950,
  'Gipuzkoa': 3700,
  'Girona': 2500,
  'Granada': 1500,
  'Guadalajara': 1400,
  'Huelva': 1300,
  'Huesca': 1400,
  'Illes Balears': 4100,
  'Jaén': 950,
  'La Coruña': 1700,
  'La Rioja': 1500,
  'Las Palmas': 2200,
  'León': 1200,
  'Lleida': 1300,
  'Lugo': 1100,
  'Madrid': 4400,
  'Málaga': 3000,
  'Melilla': 1800,
  'Murcia': 1300,
  'Navarra': 1900,
  'Ourense': 1100,
  'Palencia': 1100,
  'Pontevedra': 1600,
  'Salamanca': 1500,
  'Santa Cruz de Tenerife': 2100,
  'Segovia': 1500,
  'Sevilla': 1900,
  'Soria': 1100,
  'Tarragona': 1700,
  'Teruel': 950,
  'Toledo': 1100,
  'Valencia': 2000,
  'Valladolid': 1600,
  'Zamora': 1000,
  'Zaragoza': 1700,
};

export const PROVINCES = Object.keys(PROVINCE_PRICE_PER_SQM).sort((a, b) => a.localeCompare(b, 'es'));

export const DEFAULT_PRICE_PER_SQM = 1600;

export const TYPE_MULTIPLIER: Record<PropertyType, number> = {
  piso: 1.0,
  atico: 1.1,
  duplex: 1.05,
  estudio: 0.95,
  casa_adosada: 1.05,
  chalet: 1.15,
  casa_rural: 0.85,
};

export const CONDITION_MULTIPLIER: Record<Condition, number> = {
  a_reformar: 0.78,
  buen_estado: 1.0,
  reformado: 1.12,
  obra_nueva: 1.22,
};

export const EXTRAS_IMPACT: Record<keyof import('./types').Extras, number> = {
  ascensor: 0.03,
  parking: 0.05,
  trastero: 0.01,
  terraza: 0.03,
  balcon: 0.01,
  jardin: 0.04,
  piscina: 0.05,
  aireAcondicionado: 0.02,
  calefaccion: 0.02,
};
