export type PropertyType =
  | 'piso'
  | 'atico'
  | 'duplex'
  | 'estudio'
  | 'casa_adosada'
  | 'chalet'
  | 'casa_rural';

export type Condition =
  | 'a_reformar'
  | 'buen_estado'
  | 'reformado'
  | 'obra_nueva';

export type Intent =
  | 'vender'
  | 'comprar_otra'
  | 'refinanciar'
  | 'herencia'
  | 'curiosidad';

export type Timeframe =
  | 'inmediato'
  | '1_3_meses'
  | '3_6_meses'
  | '6_12_meses'
  | 'sin_urgencia';

export type Orientation = 'norte' | 'sur' | 'este' | 'oeste' | 'no_se';

export interface Extras {
  ascensor: boolean;
  parking: boolean;
  trastero: boolean;
  terraza: boolean;
  balcon: boolean;
  jardin: boolean;
  piscina: boolean;
  aireAcondicionado: boolean;
  calefaccion: boolean;
}

export interface Address {
  calle: string;
  numero: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
}

export interface Contact {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  prefijo: string;
}

export interface Consents {
  privacidad: boolean;
  comerciales: boolean;
  cesionInmobiliarias: boolean;
}

export interface ValuationFormData {
  tipo: PropertyType | null;
  direccion: Address;
  metrosConstruidos: number | null;
  metrosUtiles: number | null;
  dormitorios: number | null;
  banos: number | null;
  anoConstruccion: number | null;
  planta: number | null;
  orientacion: Orientation;
  estado: Condition | null;
  extras: Extras;
  intencion: Intent | null;
  plazo: Timeframe | null;
  contacto: Contact;
  consentimientos: Consents;
}

export interface ValuationBreakdownItem {
  label: string;
  impactPct: number;
  detail?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ValuationResult {
  centralEur: number;
  minEur: number;
  maxEur: number;
  pricePerSqmEur: number;
  confidence: 'baja' | 'media' | 'alta';
  source: 'heuristic' | 'gemini' | 'grounded';
  marketSummary: string;
  sellingTips: string[];
  breakdown: ValuationBreakdownItem[];
  groundingSources?: GroundingSource[];
  marketContext?: string;
}

export interface LeadPayload {
  createdAt: string;
  form: ValuationFormData;
  valuation: ValuationResult;
  utm?: Record<string, string>;
  userAgent: string;
  referrer: string;
}
