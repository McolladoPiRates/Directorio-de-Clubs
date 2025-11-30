
import React, { useState } from 'react';
import { ClubListItem } from '../types';
import { TrendingUp, Users, ChevronRight, Search } from 'lucide-react';
import { DEFAULT_CLUB_LOGO } from '../constants';

interface Props {
  clubs: ClubListItem[];
  onSelect: (club: string) => void;
}

const ClubDirectory: React.FC<Props> = ({ clubs, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtrado
  const filteredClubs = clubs.filter((club) =>
    club.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Directorio de Clubs</h1>
        <p className="text-slate-500">Selecciona un club para ver su rendimiento detallado.</p>
      </div>

      {/* Buscador */}
      <div className="max-w-md mx-auto mb-10 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar club por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* Grid de resultados */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {filteredClubs.map((club) => {
            const isPos = club.cumReturnPct >= 0;
            return (
              <div 
                key={club.club}
                onClick={() => onSelect(club.club)}
                className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                    <img 
                      src={club.logo || DEFAULT_CLUB_LOGO} 
                      alt={club.club} 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target as HTMLImageElement).src = DEFAULT_CLUB_LOGO} 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {club.club}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <TrendingUp size={12} /> Retorno
                    </div>
                    <div className={`text-lg font-bold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPos ? '+' : ''}{club.cumReturnPct.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Users size={12} /> Miembros
                    </div>
                    <div className="text-lg font-bold text-slate-700">
                      {club.members}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end text-blue-500 text-sm font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver detalle <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Estado vacío si no hay resultados */
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="text-slate-400 mb-2">
            <Search size={32} className="mx-auto opacity-50" />
          </div>
          <p className="text-slate-500 font-medium">No encontramos clubs con ese nombre.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}
    </div>
  );
};

export default ClubDirectory;
