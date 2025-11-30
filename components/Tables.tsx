import React from 'react';
import { HistoryItem, LivePosition } from '../types';

interface PortfolioTableProps {
  positions: LivePosition[];
}

interface HistoryTableProps {
  items: HistoryItem[];
}

const Pill: React.FC<{ type: string }> = ({ type }) => {
  // Normalizar entrada
  const t = (type || '').toUpperCase();
  
  // Lógica inversa al original: Solo marcamos Venta si es explícitamente SHORT/SELL.
  // Cualquier otra cosa (incluyendo string vacío) se asume Compra (LONG).
  const isSell = t === 'SHORT' || t === 'SELL' || t === 'VENTA';
  
  const color = !isSell ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100';
  const label = !isSell ? 'Compra' : 'Venta';
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${color}`}>
      {label}
    </span>
  );
};

const ProfitText: React.FC<{ value: number }> = ({ value }) => (
  <span className={`font-semibold ${value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
    {value >= 0 ? '+' : ''}{value.toFixed(2)}%
  </span>
);

export const PortfolioTable: React.FC<PortfolioTableProps> = ({ positions }) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mt-6 overflow-hidden">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Portfolio · Posiciones abiertas</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[1.5fr_3fr_1.5fr_1.5fr_1.5fr] gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
            <div>Ticker</div>
            <div>Nombre</div>
            <div>Tipo</div>
            <div>Invertido %</div>
            <div>G/P %</div>
          </div>
          <div className="space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar">
            {positions.length === 0 ? (
               <div className="text-slate-400 text-sm p-4 text-center bg-slate-50 rounded-lg">Sin posiciones abiertas.</div>
            ) : (
              positions.map((pos, idx) => (
                <div key={idx} className="grid grid-cols-[1.5fr_3fr_1.5fr_1.5fr_1.5fr] gap-4 items-center p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <img 
                      src={pos.logo} 
                      alt={pos.ticker} 
                      className="w-7 h-7 rounded bg-white object-contain border border-slate-100 shadow-sm"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/28?text=?'; }}
                    />
                    <span className="font-bold text-slate-800">{pos.ticker}</span>
                  </div>
                  <div className="font-medium text-slate-600 truncate">{pos.name}</div>
                  <div><Pill type={pos.side} /></div>
                  <div className="font-semibold text-slate-700">{pos.investmentPctAvg.toFixed(2)}%</div>
                  <div><ProfitText value={pos.netProfitAvg} /></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const HistoryTable: React.FC<HistoryTableProps> = ({ items }) => {
  const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mt-6 overflow-hidden">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Historial de operaciones</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
           <div className="grid grid-cols-[1.5fr_3fr_1fr_1.5fr_1.5fr_1fr] gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
            <div>Ticker</div>
            <div>Nombre</div>
            <div>Tipo</div>
            <div>Apertura</div>
            <div>Cierre</div>
            <div>G/P %</div>
          </div>
          <div className="space-y-1 max-h-[350px] overflow-y-auto custom-scrollbar">
             {items.length === 0 ? (
               <div className="text-slate-400 text-sm p-4 text-center bg-slate-50 rounded-lg">Sin historial reciente.</div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1.5fr_3fr_1fr_1.5fr_1.5fr_1fr] gap-4 items-center p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                     <img 
                      src={item.logo} 
                      alt={item.ticker} 
                      className="w-7 h-7 rounded bg-white object-contain border border-slate-100 shadow-sm"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/28?text=?'; }}
                    />
                    <span className="font-bold text-slate-800">{item.ticker}</span>
                  </div>
                  <div className="font-medium text-slate-600 truncate">{item.name}</div>
                  <div><Pill type={item.type} /></div>
                  <div className="text-sm text-slate-500">{formatDate(item.openTimestamp)}</div>
                  <div className="text-sm text-slate-500">{formatDate(item.closeTimestamp)}</div>
                  <div><ProfitText value={item.gpPct} /></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};