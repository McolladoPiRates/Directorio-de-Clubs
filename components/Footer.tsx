import React from 'react';
import { Home } from 'lucide-react';
import { COMPANY_EMAIL, COMPANY_NAME } from '../constants';

interface Props {
  onLegal: (slug: 'privacidad' | 'aviso' | 'cookies' | 'leads') => void;
}

const Footer: React.FC<Props> = ({ onLegal }) => (
  <footer className="bg-slate-900 text-slate-300">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 text-white font-bold">
          <span className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Home size={18} />
          </span>
          {COMPANY_NAME}
        </div>
        <p className="mt-4 text-sm text-slate-400 max-w-md">
          Servicio de valoración online orientativa de viviendas. No sustituye una tasación oficial homologada por el Banco de España.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Contacto: <a href={`mailto:${COMPANY_EMAIL}`} className="underline hover:text-white">{COMPANY_EMAIL}</a>
        </p>
      </div>

      <div>
        <div className="text-sm font-semibold text-white mb-3">Legal</div>
        <ul className="space-y-2 text-sm">
          <li><button onClick={() => onLegal('privacidad')} className="hover:text-white text-left">Política de privacidad</button></li>
          <li><button onClick={() => onLegal('cookies')} className="hover:text-white text-left">Política de cookies</button></li>
          <li><button onClick={() => onLegal('aviso')} className="hover:text-white text-left">Aviso legal</button></li>
          <li><button onClick={() => onLegal('leads')} className="hover:text-white text-left">Tratamiento y cesión de datos</button></li>
        </ul>
      </div>

      <div>
        <div className="text-sm font-semibold text-white mb-3">Sobre la valoración</div>
        <p className="text-xs text-slate-400 leading-relaxed">
          La estimación es orientativa y se genera con inteligencia artificial sobre precios medios de mercado. El valor real depende de variables que requieren inspección presencial.
        </p>
      </div>
    </div>

    <div className="border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-xs text-slate-500 flex flex-col sm:flex-row gap-2 justify-between">
        <div>© {new Date().getFullYear()} {COMPANY_NAME}. Todos los derechos reservados.</div>
        <div>Servicio operado bajo cumplimiento del RGPD (UE) 2016/679 y la LOPDGDD 3/2018.</div>
      </div>
    </div>
  </footer>
);

export default Footer;
