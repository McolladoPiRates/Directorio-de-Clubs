
import React from 'react';
import { ClubListItem } from '../types';
import { Users, TrendingUp, ChevronRight } from 'lucide-react';
import { DEFAULT_CLUB_LOGO } from '../constants';

interface ClubGridProps {
  clubs: ClubListItem[];
  onSelectClub: (clubName: string) => void;
}

const ClubCard: React.FC<{ club: ClubListItem; onClick: () => void }> = ({ club, onClick }) => {
  // Aseguramos que sea número antes de toFixed
  const safeCumReturn = typeof club.cumReturnPct === 'number' ? club.cumReturnPct : 0;
  
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 w-24 h-24 rounded-full bg-white border-2 border-slate-100 shadow-md mb-4 overflow-hidden group-hover:scale-105 transition-transform">
        <img 
          src={club.logo || DEFAULT_CLUB_LOGO} 
          alt={club.club} 
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_CLUB_LOGO; }}
        />
      </div>
      
      <h3 className="relative z-10 text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
        {club.club}
      </h3>
      
      <div className="relative z-10 w-full grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
            <TrendingUp size={14} /> Rentabilidad
          </div>
          <span className={`text-lg font-bold ${safeCumReturn >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {safeCumReturn > 0 ? '+' : ''}{safeCumReturn.toFixed(2)}%
          </span>
        </div>
        <div className="flex flex-col items-center border-l border-slate-100">
           <div className="flex items-center gap-1.5 text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">
            <Users size={14} /> Miembros
          </div>
          <span className="text-lg font-bold text-slate-700">
            {club.members}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-6 text-blue-500 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
        Ver estadísticas <ChevronRight size={16} />
      </div>
    </div>
  );
};

const ClubGrid: React.FC<ClubGridProps> = ({ clubs, onSelectClub }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Clubs de Inversión</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Explora las estadísticas detalladas, carteras y rendimiento histórico de nuestros clubs de inversión.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <ClubCard 
            key={club.club} 
            club={club} 
            onClick={() => onSelectClub(club.club)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ClubGrid;
