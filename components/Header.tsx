
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { DashboardData } from '../types';
import { DEFAULT_CLUB_LOGO } from '../constants';

interface HeaderProps {
  data: DashboardData;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ data, onBack }) => {
  const formattedDate = new Date(data.lastUpdate).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="flex flex-col gap-6 mb-8">
      {onBack && (
        <button 
          onClick={onBack}
          className="self-start flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/50"
        >
          <ArrowLeft size={18} />
          Volver al directorio
        </button>
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
            <img
              src={data.clubLogo || DEFAULT_CLUB_LOGO}
              alt="Club Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_CLUB_LOGO;
              }}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            {data.summary.club}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white/60 px-3 py-1.5 rounded-full border border-slate-200 backdrop-blur-sm">
          <span className="text-slate-500">Actualizado:</span>
          <span className="font-medium text-slate-700">{formattedDate}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
