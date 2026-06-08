import React from 'react';
import { AlertTriangle, Sparkles, Mail, CheckCircle2, Info, RefreshCw } from 'lucide-react';
import { COMPANY_NAME } from '../../constants';
import type { ValuationFormData, ValuationResult } from '../../types';
import { formatEur, formatNumber } from '../../utils';

interface Props {
  data: ValuationFormData;
  valuation: ValuationResult;
  webhookOk: boolean;
  onRestart: () => void;
  onLegal: (slug: 'privacidad' | 'aviso' | 'cookies' | 'leads') => void;
}

const ConfidenceBadge: React.FC<{ level: ValuationResult['confidence'] }> = ({ level }) => {
  const colors = {
    baja: 'bg-amber-50 text-amber-700 border-amber-200',
    media: 'bg-brand-50 text-brand-700 border-brand-200',
    alta: 'bg-accent-500/10 text-accent-600 border-accent-500/30',
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[level]}`}>
      <Sparkles size={12} /> Confianza {level}
    </span>
  );
};

const StepResult: React.FC<Props> = ({ data, valuation, webhookOk, onRestart, onLegal }) => {
  const { centralEur, minEur, maxEur, pricePerSqmEur, marketSummary, sellingTips, breakdown, source } = valuation;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent-600 bg-accent-500/10 px-3 py-1 rounded-full">
          <CheckCircle2 size={14} /> Estimación lista para {data.contacto.nombre || 'ti'}
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
          Tu vivienda se sitúa en torno a
        </h2>
        <div className="mt-2 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {formatEur(centralEur)}
        </div>
        <div className="mt-2 text-slate-600 text-sm">
          Rango estimado: <span className="font-semibold text-slate-800">{formatEur(minEur)} – {formatEur(maxEur)}</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          <ConfidenceBadge level={valuation.confidence} />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
            {formatNumber(pricePerSqmEur)} €/m²
          </span>
          {source === 'gemini' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-900 text-white border-slate-900">
              <Sparkles size={12} /> Refinada con IA
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Lectura del mercado</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{marketSummary}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Cómo hemos calculado el valor</h3>
          <ul className="space-y-2">
            {breakdown.map((b) => (
              <li key={b.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  {b.label}
                  {b.detail && <span className="ml-2 text-xs text-slate-400">{b.detail}</span>}
                </span>
                <span className={[
                  'font-semibold tabular-nums',
                  b.impactPct > 0 ? 'text-accent-600' : b.impactPct < 0 ? 'text-rose-600' : 'text-slate-400',
                ].join(' ')}>
                  {b.impactPct === 0 ? '—' : `${b.impactPct > 0 ? '+' : ''}${b.impactPct.toFixed(1)}%`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-900 mb-3">Consejos para vender mejor</h3>
        <ul className="space-y-2">
          {sellingTips.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 size={16} className="text-accent-500 flex-shrink-0 mt-0.5" /> {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex gap-3">
        <AlertTriangle size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900 leading-relaxed">
          <p className="font-semibold mb-1">Aviso importante</p>
          <p>
            Esta es una <strong>estimación orientativa</strong> calculada con inteligencia artificial sobre precios medios de mercado y los datos que has aportado.
            No constituye una tasación oficial conforme a la Orden ECO/805/2003 y no puede emplearse para fines hipotecarios, judiciales ni fiscales.
            Para esos usos necesitas una sociedad de tasación homologada por el Banco de España.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Mail size={16} className="text-brand-600" />
          {webhookOk
            ? <span>Hemos guardado tu solicitud y te enviaremos el informe a <strong>{data.contacto.email}</strong>.</span>
            : <span>Guardamos tu solicitud. Si en unos minutos no llega el email, escríbenos.</span>}
        </div>
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-white"
        >
          <RefreshCw size={14} /> Tasar otra vivienda
        </button>
      </div>

      <div className="text-xs text-slate-400 flex items-start gap-2">
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <p>
          {COMPANY_NAME} aplica un proceso parcialmente automatizado para generar esta estimación. Puedes solicitar revisión humana
          o ejercer tus derechos RGPD en cualquier momento.
        </p>
      </div>
    </div>
  );
};

export default StepResult;
