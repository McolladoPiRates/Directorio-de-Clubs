import React from 'react';
import { Home, Menu, X } from 'lucide-react';
import { COMPANY_NAME } from '../constants';

interface Props {
  onStart: () => void;
  onLegal: (slug: 'privacidad' | 'aviso' | 'cookies' | 'leads') => void;
}

const Header: React.FC<Props> = ({ onStart, onLegal }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
            <Home size={18} />
          </span>
          <span className="text-base sm:text-lg">{COMPANY_NAME}</span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600">
          <a href="#como-funciona" className="hover:text-slate-900">Cómo funciona</a>
          <a href="#por-que" className="hover:text-slate-900">Por qué tasamos así</a>
          <a href="#preguntas" className="hover:text-slate-900">Preguntas frecuentes</a>
          <button onClick={() => onLegal('privacidad')} className="hover:text-slate-900">Privacidad</button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onStart}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition"
          >
            Tasa tu vivienda
          </button>
          <button
            className="md:hidden text-slate-700 p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-3 text-sm text-slate-700">
            <a href="#como-funciona" onClick={() => setOpen(false)}>Cómo funciona</a>
            <a href="#por-que" onClick={() => setOpen(false)}>Por qué tasamos así</a>
            <a href="#preguntas" onClick={() => setOpen(false)}>Preguntas frecuentes</a>
            <button onClick={() => { setOpen(false); onLegal('privacidad'); }} className="text-left">Política de privacidad</button>
            <button
              onClick={() => { setOpen(false); onStart(); }}
              className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition"
            >
              Tasa tu vivienda
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
