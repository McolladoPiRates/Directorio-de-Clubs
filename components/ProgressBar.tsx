import React from 'react';

interface Props {
  current: number;
  total: number;
}

const ProgressBar: React.FC<Props> = ({ current, total }) => {
  const pct = Math.min(100, Math.max(0, ((current + 1) / total) * 100));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span className="font-medium text-slate-700">Paso {current + 1} de {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
