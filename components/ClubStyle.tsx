import React from 'react';
import { RadarMetrics } from '../types';

interface ClubStyleProps {
  radar: RadarMetrics;
}

const StyleRow: React.FC<{
  left: string;
  right: string;
  value: number; // 0 to 100
  colorClass: string;
}> = ({ left, right, value, colorClass }) => (
  <div className="grid grid-cols-1 md:grid-cols-[1fr_6fr_1fr] gap-2 md:gap-4 items-center">
    <div className="text-sm font-medium text-slate-800 md:text-right">{left}</div>
    
    <div className="relative h-6 w-full rounded-full bg-slate-100 overflow-hidden group">
      <div 
        className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ease-out ${colorClass}`} 
        style={{ width: `${value}%` }}
      />
      {/* Hatch pattern overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 8px, transparent 8px, transparent 16px)' }} 
      />
      
      {/* Tooltip on hover */}
      <div 
        className="absolute top-[-30px] -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `${value}%` }}
      >
        {value}%
      </div>
    </div>
    
    <div className="text-sm font-medium text-slate-800 text-right md:text-left">{right}</div>
  </div>
);

const ClubStyle: React.FC<ClubStyleProps> = ({ radar }) => {
  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
  
  // Logic from original code
  const agresividad = Math.round(100 * clamp01((Math.abs(radar.mdd || 0) / 60) * 0.7 + (Number(radar.vol || 0) / 20) * 0.3));
  const diversif = Math.round(100 * (1 - clamp01((Number(radar.top1 || 0)) / 60)));
  const horiz = Math.round(100 * clamp01((Number(radar.avgd || 0)) / 45));
  const convic = Math.round(100 * clamp01((Number(radar.top1 || 0) / 60) * 0.6 + (Number(radar.avgd || 0) / 45) * 0.4));
  
  const longp = Number(radar.longp || 0);
  const shortp = Number(radar.shortp || 0);
  const sesgoLS = Math.round(clamp01((longp - shortp + 100) / 200) * 100);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Estilo del club</h3>
      <div className="space-y-6">
        <StyleRow 
          left="Conservador" 
          right="Agresivo" 
          value={agresividad} 
          colorClass="bg-rose-300" 
        />
        <StyleRow 
          left="Concentrado" 
          right="Diversificado" 
          value={diversif} 
          colorClass="bg-amber-200" 
        />
        <StyleRow 
          left="Corto plazo" 
          right="Largo plazo" 
          value={horiz} 
          colorClass="bg-blue-200" 
        />
        <StyleRow 
          left="Baja convicción" 
          right="Alta convicción" 
          value={convic} 
          colorClass="bg-violet-300" 
        />
        <StyleRow 
          left="Short" 
          right="Long" 
          value={sesgoLS} 
          colorClass="bg-emerald-300" 
        />
      </div>
    </section>
  );
};

export default ClubStyle;