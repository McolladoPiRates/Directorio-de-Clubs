
import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, AlertTriangle, Database } from 'lucide-react';
import { BACKEND_URL } from './constants';
import { ClubListItem, DashboardData } from './types';
import { toNum, toStr, toDateStr } from './utils';

// Components
import ClubDirectory from './components/ClubDirectory';
import ClubDashboard from './components/ClubDashboard';

type ViewState = 'loading' | 'directory' | 'dashboard' | 'error';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('loading');
  const [clubList, setClubList] = useState<ClubListItem[]>([]);
  const [selectedClubData, setSelectedClubData] = useState<DashboardData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLegacyBackend, setIsLegacyBackend] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 0. AUTO-RESIZE PARA WORDPRESS (IFRAME)
  useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      // Enviamos mensaje al padre (WordPress)
      window.parent.postMessage({ type: 'ETORO_APP_RESIZE', height }, '*');
    };

    const observer = new ResizeObserver(() => {
      sendHeight();
    });

    observer.observe(document.body);
    // Enviar altura inicial y en cambios de ventana
    sendHeight();
    window.addEventListener('resize', sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sendHeight);
    };
  }, [view, selectedClubData]); // Recalcular cuando cambie la vista

  // 1. INICIO: Cargar lista de clubs
  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async () => {
    try {
      setView('loading');
      
      // Añadimos timestamp para romper caché del navegador
      const res = await fetch(`${BACKEND_URL}?action=getClubs&t=${Date.now()}`);
      
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      
      // Leemos texto primero para depurar si devuelve HTML de error
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error("Respuesta no válida:", text.substring(0, 200));
        throw new Error("El servidor devolvió HTML en lugar de JSON. Revisa el script.");
      }
      
      let list: ClubListItem[] = [];

      if (Array.isArray(json)) {
        // CASO CORRECTO: El backend devuelve una lista
        setIsLegacyBackend(false);
        list = json.map(mapToClubListItem);
      } else if (json && (json.club || json.summary)) {
        // CASO ERROR: El backend devuelve un solo objeto (versión antigua)
        setIsLegacyBackend(true);
        setDebugInfo("Recibido objeto único en lugar de array. El endpoint ejecuta código antiguo.");
        list = [mapToClubListItem(json)];
      } else {
        // CASO ERROR: Respuesta vacía o desconocida
        setIsLegacyBackend(true);
        setDebugInfo(`Respuesta desconocida: ${JSON.stringify(json).slice(0, 100)}...`);
        // Intentamos recuperar algo si es posible, o lista vacía
        list = [];
      }

      if (list.length === 0) {
        setDebugInfo("La lista de clubs está vacía. Verifica que la hoja 'Clubs' tenga datos.");
        // No lanzamos error fatal, mostramos pantalla vacía con aviso
      }

      setClubList(list);
      setView('directory');

    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido cargando el directorio.");
      setView('error');
    }
  };

  const fetchClubDetail = async (clubName: string) => {
    try {
      setView('loading');
      const res = await fetch(`${BACKEND_URL}?club=${encodeURIComponent(clubName)}&t=${Date.now()}`);
      
      if (!res.ok) throw new Error('Error cargando detalle del club');
      
      const json = await res.json();
      const cleanData = sanitizeDashboard(json);
      
      setSelectedClubData(cleanData);
      setView('dashboard');
      // Scroll arriba al cambiar de vista
      window.scrollTo(0, 0);

    } catch (err) {
      console.error(err);
      setErrorMessage(`Error cargando datos de ${clubName}`);
      setView('error');
    }
  };

  // --- MAPPERS ---

  const mapToClubListItem = (raw: any): ClubListItem => {
    const s = raw.summary || {};
    return {
      club: toStr(raw.club || s.club || 'Club Desconocido'),
      logo: toStr(raw.logo || raw.clubLogo || s.logo),
      cumReturnPct: toNum(raw.cumReturnPct !== undefined ? raw.cumReturnPct : s.cumReturnPct),
      members: toNum(raw.members !== undefined ? raw.members : s.members)
    };
  };

  const sanitizeDashboard = (raw: any): DashboardData => {
    const s = raw.summary || {};
    const r = raw.radar || {};
    
    return {
      summary: {
        position: toNum(s.position),
        club: toStr(s.club || raw.club),
        cumReturnPct: toNum(s.cumReturnPct),
        members: toNum(s.members),
        link: toStr(s.link)
      },
      clubLogo: toStr(raw.clubLogo),
      lastUpdate: toDateStr(raw.lastUpdate),
      
      radar: {
        sharpe: toNum(r.sharpe),
        vol: toNum(r.vol),
        mdd: toNum(r.mdd),
        win: toNum(r.win),
        pf: toNum(r.pf),
        top1: toNum(r.top1),
        longp: toNum(r.longp),
        shortp: toNum(r.shortp),
        avgd: toNum(r.avgd)
      },
      
      curve: Array.isArray(raw.curve) ? raw.curve.map((c:any) => ({
        month: toStr(c?.month),
        cumPct: toNum(c?.cumPct)
      })).filter((c:any) => c.month) : [],

      live: Array.isArray(raw.live) ? raw.live.map((l:any) => ({
        ticker: toStr(l?.ticker),
        name: toStr(l?.name),
        side: toStr(l?.side),
        investmentPctAvg: toNum(l?.investmentPctAvg),
        netProfitAvg: toNum(l?.netProfitAvg),
        logo: toStr(l?.logo)
      })) : [],

      history: Array.isArray(raw.history) ? raw.history.map((h:any) => ({
        ticker: toStr(h?.ticker),
        name: toStr(h?.name),
        type: toStr(h?.type),
        openTimestamp: toStr(h?.openTimestamp),
        closeTimestamp: toStr(h?.closeTimestamp),
        gpPct: toNum(h?.gpPct),
        logo: toStr(h?.logo)
      })) : [],
      
      members: Array.isArray(raw.members) ? raw.members.map((m: any) => ({
        username: toStr(m?.username),
        name: toStr(m?.name),
        avatar: toStr(m?.avatar),
        perfil: toStr(m?.perfil)
      })) : []
    };
  };

  // --- RENDER ---

  if (view === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
        <p>Conectando con Google Sheets...</p>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Error de Conexión</h3>
          <p className="text-sm text-slate-500 mb-6">{errorMessage}</p>
          <div className="flex gap-3">
             <button onClick={() => window.open(BACKEND_URL + '?action=getClubs', '_blank')} className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs">
              Ver Datos Raw
            </button>
            <button onClick={() => window.location.reload()} className="flex-1 py-2 px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2 text-sm">
              <RefreshCw size={16} /> Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'directory') {
    return (
      <div className="relative">
        {isLegacyBackend && (
          <div className="bg-rose-100 border-b border-rose-200 text-rose-900 px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-start gap-4">
              <Database className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">¡Estás viendo datos antiguos!</h3>
                <p className="text-sm mb-2">
                  La aplicación ha recibido datos del Spreadsheet antiguo o una versión vieja del script.
                  Esto ocurre porque Google Apps Script no actualiza la URL pública automáticamente al guardar.
                </p>
                <div className="text-sm bg-white/50 p-3 rounded border border-rose-200 font-mono text-rose-800">
                  1. Ve a Apps Script {'>'} Implementar {'>'} Gestionar implementaciones.<br/>
                  2. Edita la activa (Lápiz).<br/>
                  3. Cambia Versión a "Nueva versión".<br/>
                  4. Pulsa Implementar.
                </div>
                {debugInfo && <div className="mt-2 text-xs opacity-75">Debug: {debugInfo}</div>}
              </div>
            </div>
          </div>
        )}
        
        {clubList.length === 0 ? (
           <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
             <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
             <h2 className="text-xl font-semibold text-slate-600 mb-2">No se encontraron clubs</h2>
             <p className="max-w-md text-center">
               El script devolvió una lista vacía. Verifica que la pestaña <b>"Clubs"</b> en tu Google Sheet (ID: ...0CpPI) tenga nombres en la columna A o B.
             </p>
           </div>
        ) : (
          <ClubDirectory clubs={clubList} onSelect={fetchClubDetail} />
        )}
      </div>
    );
  }

  return <ClubDashboard data={selectedClubData!} onBack={() => {
    setSelectedClubData(null);
    fetchDirectory();
  }} />;
};

export default App;
