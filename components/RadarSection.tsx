
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Member, RadarMetrics } from '../types';
import MembersCard from './MembersCard';

interface RadarSectionProps {
  metrics: RadarMetrics;
  members: Member[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 text-white text-xs p-3 rounded-xl shadow-xl backdrop-blur-md border border-slate-700/50 min-w-[140px] z-50">
        <div className="font-bold text-slate-300 mb-1 uppercase tracking-wider text-[10px]">{data.subject}</div>
        <div className="flex items-baseline gap-1.5 mb-1.5 border-b border-slate-700 pb-2">
          <span className="text-2xl font-bold text-white leading-none">{data.A.toFixed(1)}</span>
          <span className="text-slate-500 font-medium text-[10px]">/ 10</span>
        </div>
        <div className="text-slate-400 flex justify-between items-center">
          <span>Real:</span>
          <span className="text-white font-mono font-medium">{data.raw}</span>
        </div>
      </div>
    );
  }
  return null;
};

const RadarMetricsCard: React.FC<{ metrics: RadarMetrics }> = ({ metrics }) => {
  // Helper para normalizar valores a una nota de 0 a 10
  const calcScore = (val: number, min: number, max: number, inverse = false) => {
    let normalized = (val - min) / (max - min);
    if (inverse) normalized = 1 - normalized;
    return Math.min(Math.max(normalized * 10, 0), 10);
  };

  // Definición de métricas y sus rangos para la puntuación (ESCALAS CORREGIDAS)
  const scores = [
    { 
      label: 'Sharpe', 
      raw: metrics.sharpe, 
      score: calcScore(metrics.sharpe, 0, 3.0), // 0 es malo, 3.0 es excelente
      fmt: (v: number) => v.toFixed(2) 
    },
    { 
      label: 'Win Rate', 
      raw: metrics.win, 
      score: calcScore(metrics.win, 25, 75), // 25% es muy malo (0), 75% es excelente (10). 50% es nota 5.
      fmt: (v: number) => v.toFixed(1) + '%' 
    },
    { 
      label: 'Profit F.', 
      raw: metrics.pf, 
      score: calcScore(metrics.pf, 0.8, 3.0), // 0.8 es malo, 3.0 es excelente
      fmt: (v: number) => v.toFixed(2) 
    },
    { 
      label: 'Drawdown', 
      raw: Math.abs(metrics.mdd), 
      score: calcScore(Math.abs(metrics.mdd), 0, 35, true), // Inverso: 0% es excelente (10), 35% es malo (0)
      fmt: (v: number) => v.toFixed(1) + '%' 
    },
    { 
      label: 'Diversif.', 
      raw: metrics.top1, 
      score: calcScore(metrics.top1, 10, 50, true), // Inverso: Top1 10% es excelente (muy diversificado), 50% concentrado
      fmt: (v: number) => v.toFixed(1) + '%' 
    },
    { 
      label: 'Estabilidad', // Usamos Volatilidad
      raw: metrics.vol, 
      score: calcScore(metrics.vol, 3, 15, true), // Inverso: Vol 3% es excelente (muy estable), 15% inestable
      fmt: (v: number) => v.toFixed(1) + '%' 
    }
  ];

  const data = scores.map(s => ({
    subject: s.label,
    A: s.score,
    fullMark: 10,
    raw: s.fmt(s.raw)
  }));

  // Calcular color basado en la nota media
  const avgScore = scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length;
  
  let themeColor = '#3b82f6'; // Azul por defecto (4 <= nota < 7)
  let fillColor = '#3b82f6';

  if (avgScore >= 7) {
    themeColor = '#10b981'; // Verde (Emerald 500)
    fillColor = '#10b981';
  } else if (avgScore < 4) {
    themeColor = '#ef4444'; // Rojo (Red 500)
    fillColor = '#ef4444';
  }

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Radar de calidad</h3>
        <div className={`text-xs font-bold px-2 py-1 rounded-full text-white`} style={{ backgroundColor: themeColor }}>
          Nota Media: {avgScore.toFixed(1)}
        </div>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 10]} 
              tick={false} 
              axisLine={false} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Nota"
              dataKey="A"
              stroke={themeColor}
              strokeWidth={3}
              fill={fillColor}
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-[10px] text-slate-400">
        Escala 0 (Deficiente) a 10 (Excelente)
      </div>
    </aside>
  );
};

const RadarSection: React.FC<RadarSectionProps> = ({ metrics, members }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="h-[250px]">
         <MembersCard members={members} />
      </div>
      <div className="flex-1 min-h-[350px]">
        <RadarMetricsCard metrics={metrics} />
      </div>
    </div>
  );
};

export default RadarSection;
