import React from 'react';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'tasador_cookie_consent_v1';

interface Props {
  onShowPolicy: () => void;
}

const CookieBanner: React.FC<Props> = ({ onShowPolicy }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (choice: 'all' | 'essential') => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() }),
      );
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md z-40 animate-fade-up">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Cookie size={18} />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">Usamos cookies</div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Utilizamos cookies técnicas necesarias para que la web funcione y, si lo aceptas, cookies de
              analítica para mejorar el servicio. Puedes consultar nuestra{' '}
              <button onClick={onShowPolicy} className="underline text-brand-600">
                política de cookies
              </button>
              .
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => decide('essential')}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Solo necesarias
              </button>
              <button
                onClick={() => decide('all')}
                className="flex-1 px-3 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
