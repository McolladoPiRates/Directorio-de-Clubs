
export interface ClubListItem {
  club: string;
  logo: string;
  cumReturnPct: number;
  members: number;
}

export interface Summary {
  position: number;
  club: string;
  cumReturnPct: number;
  members: number;
  link: string;
}

export interface CurvePoint {
  month: string;
  cumPct: number;
}

export interface RadarMetrics {
  sharpe: number;
  vol: number;
  mdd: number;
  win: number;
  pf: number;
  top1: number;
  longp: number;
  shortp: number;
  avgd: number;
}

export interface LivePosition {
  ticker: string;
  name: string;
  side: string;
  investmentPctAvg: number;
  netProfitAvg: number;
  logo: string;
}

export interface HistoryItem {
  ticker: string;
  name: string;
  type: string;
  openTimestamp: string;
  closeTimestamp: string;
  gpPct: number;
  logo: string;
}

export interface Member {
  username: string;
  name: string;
  avatar: string;
  perfil: string;
}

export interface DashboardData {
  summary: Summary;
  curve: CurvePoint[];
  radar: RadarMetrics;
  live: LivePosition[];
  history: HistoryItem[];
  members: Member[];
  clubLogo: string;
  lastUpdate: string;
}
