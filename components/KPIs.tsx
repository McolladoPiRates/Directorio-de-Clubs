import React from 'react';
import { RadarMetrics, Summary } from '../types';

interface KPIProps {
  radar: RadarMetrics;
  summary: Summary;
}

const KPICard: React.FC<{
  title: string;
  value: string;
  subValue: string;
  blobColor1: string;
  blobColor2: string;
}> = ({ title, value, subValue, blobColor1, blobColor2 }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Blob Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(120% 70% at 20% 100%, ${blobColor1} 0%, transparent 60%),
            radial-gradient(120% 70% at 100% -10%, ${blobColor2} 0%, transparent 60%)
          `
        }}
      />
      
      <div className="relative z-10">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium">
          {subValue}
        </div>
      </div>
    </div>
  );
};

const KPIs: React.FC<KPIProps> = ({ radar, summary }) => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Rentabilidad acumulada"
        value={`${summary.cumReturnPct.toFixed(2)}%`}
        subValue={`Ranking #${summary.position}`}
        blobColor1="rgba(244,209,35,0.45)"
        blobColor2="rgba(255,255,255,0)"
      />
      <KPICard
        title="Sharpe (mensual)"
        value={radar.sharpe.toFixed(3)}
        subValue="Estabilidad del retorno"
        blobColor1="rgba(88,185,255,0.45)"
        blobColor2="rgba(255,255,255,0)"
      />
      <KPICard
        title="Win Rate"
        value={`${radar.win.toFixed(1)}%`}
        subValue="Operaciones ganadoras"
        blobColor1="rgba(255,122,122,0.45)"
        blobColor2="rgba(255,255,255,0)"
      />
      <KPICard
        title="Profit Factor"
        value={radar.pf.toFixed(2)}
        subValue={`Drawdown: ${radar.mdd.toFixed(1)}%`}
        blobColor1="rgba(245,158,11,0.40)"
        blobColor2="rgba(124,58,237,0.35)"
      />
    </section>
  );
};

export default KPIs;