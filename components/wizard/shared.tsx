import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const StepShell: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="animate-fade-up">
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h2>
    {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
    <div className="mt-6">{children}</div>
  </div>
);

export const NavButtons: React.FC<{
  onPrev?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showPrev?: boolean;
  prevLabel?: string;
  loading?: boolean;
}> = ({ onPrev, onNext, nextLabel = 'Continuar', nextDisabled, showPrev = true, prevLabel = 'Atrás', loading }) => (
  <div className="mt-8 flex items-center justify-between gap-3">
    {showPrev && onPrev ? (
      <button
        type="button"
        onClick={onPrev}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        {prevLabel}
      </button>
    ) : (
      <span />
    )}
    {onNext && (
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Analizando el mercado de tu zona…' : nextLabel}
        {!loading && <ArrowRight size={16} />}
      </button>
    )}
  </div>
);

export const OptionCard: React.FC<{
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  compact?: boolean;
}> = ({ selected, onClick, title, description, icon, compact }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'text-left rounded-2xl border transition-all w-full',
      compact ? 'p-3' : 'p-4 sm:p-5',
      selected
        ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-100'
        : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/30',
    ].join(' ')}
  >
    <div className="flex items-start gap-3">
      {icon && (
        <div className={[
          'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
          selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600',
        ].join(' ')}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-900 text-sm sm:text-base">{title}</div>
        {description && <div className="text-xs sm:text-sm text-slate-500 mt-0.5">{description}</div>}
      </div>
    </div>
  </button>
);

export const Field: React.FC<{
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, hint, error, children }) => (
  <label className="block">
    <span className="text-sm font-medium text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </span>
    <div className="mt-1.5">{children}</div>
    {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
  </label>
);

export const inputClass =
  'block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500';
