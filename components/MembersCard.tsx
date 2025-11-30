
import React from 'react';
import { Member } from '../types';

interface MembersCardProps {
  members: Member[];
}

const MembersCard: React.FC<MembersCardProps> = ({ members }) => {
  return (
    <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-800">Miembros del club</h3>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          {members.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 min-h-[150px] max-h-[250px]">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-6">
            <p className="text-sm">Sin miembros registrados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((m, idx) => (
              <a
                key={`${m.username}-${idx}`}
                href={m.perfil}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-200 flex-shrink-0 shadow-sm">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback a iniciales si la imagen falla
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback de iniciales (oculto por defecto) */}
                  <div className="hidden w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold text-xs">
                    {m.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                    {m.name}
                  </span>
                  <span className="text-xs text-slate-500 truncate">
                    @{m.username}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default MembersCard;
