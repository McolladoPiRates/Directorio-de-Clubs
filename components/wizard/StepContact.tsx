import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import type { ValuationFormData } from '../../types';
import { isValidEmail, isValidSpanishPhone } from '../../utils';
import { Field, NavButtons, StepShell, inputClass } from './shared';

interface Props {
  data: ValuationFormData;
  update: (patch: Partial<ValuationFormData>) => void;
  onPrev: () => void;
  onSubmit: () => void;
  loading: boolean;
  onLegal: (slug: 'privacidad' | 'aviso' | 'cookies' | 'leads') => void;
}

const StepContact: React.FC<Props> = ({ data, update, onPrev, onSubmit, loading, onLegal }) => {
  const c = data.contacto;
  const cons = data.consentimientos;

  const setContact = (patch: Partial<ValuationFormData['contacto']>) =>
    update({ contacto: { ...c, ...patch } });
  const setConsent = (patch: Partial<ValuationFormData['consentimientos']>) =>
    update({ consentimientos: { ...cons, ...patch } });

  const emailError = c.email && !isValidEmail(c.email) ? 'Introduce un email válido.' : '';
  const phoneError = c.telefono && !isValidSpanishPhone((c.prefijo || '+34') + c.telefono) ? 'Introduce un teléfono válido.' : '';

  const canSubmit =
    c.nombre.trim().length > 1 &&
    isValidEmail(c.email) &&
    isValidSpanishPhone((c.prefijo || '+34') + c.telefono) &&
    cons.privacidad;

  return (
    <StepShell
      title="Ya casi está. ¿A dónde te enviamos la tasación?"
      subtitle="Te mostraremos la estimación inmediatamente y te la enviaremos también por email."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nombre" required>
          <input
            className={inputClass}
            value={c.nombre}
            onChange={(e) => setContact({ nombre: e.target.value })}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Apellidos">
          <input
            className={inputClass}
            value={c.apellidos}
            onChange={(e) => setContact({ apellidos: e.target.value })}
            autoComplete="family-name"
          />
        </Field>
        <Field label="Email" required error={emailError}>
          <input
            type="email"
            className={inputClass}
            value={c.email}
            onChange={(e) => setContact({ email: e.target.value })}
            autoComplete="email"
            placeholder="tu@email.com"
          />
        </Field>
        <Field label="Teléfono" required error={phoneError}>
          <div className="flex gap-2">
            <select
              className={inputClass + ' max-w-[110px]'}
              value={c.prefijo || '+34'}
              onChange={(e) => setContact({ prefijo: e.target.value })}
            >
              <option value="+34">🇪🇸 +34</option>
              <option value="+351">🇵🇹 +351</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+49">🇩🇪 +49</option>
            </select>
            <input
              type="tel"
              className={inputClass}
              value={c.telefono}
              onChange={(e) => setContact({ telefono: e.target.value.replace(/[^\d\s]/g, '') })}
              autoComplete="tel-national"
              placeholder="600 123 456"
            />
          </div>
        </Field>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <ShieldCheck size={14} className="text-accent-600" /> Consentimientos (RGPD)
        </div>

        <Consent
          checked={cons.privacidad}
          onChange={(v) => setConsent({ privacidad: v })}
          required
        >
          He leído y acepto la{' '}
          <button type="button" className="text-brand-600 underline" onClick={() => onLegal('privacidad')}>
            Política de privacidad
          </button>{' '}
          y el{' '}
          <button type="button" className="text-brand-600 underline" onClick={() => onLegal('aviso')}>
            Aviso legal
          </button>
          .
        </Consent>

        <Consent
          checked={cons.comerciales}
          onChange={(v) => setConsent({ comerciales: v })}
        >
          Acepto recibir comunicaciones según se describe en la{' '}
          <button type="button" className="text-brand-600 underline" onClick={() => onLegal('privacidad')}>
            Política de privacidad
          </button>
          .
        </Consent>

        <Consent
          checked={cons.cesionInmobiliarias}
          onChange={(v) => setConsent({ cesionInmobiliarias: v })}
        >
          Autorizo el tratamiento y la{' '}
          <button type="button" className="text-brand-600 underline" onClick={() => onLegal('leads')}>
            cesión de mis datos a terceros colaboradores
          </button>{' '}
          en los términos detallados en dicha política.
        </Consent>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Lock size={12} /> Conexión segura. Tus datos viajan cifrados.
      </div>

      <NavButtons
        onPrev={onPrev}
        onNext={onSubmit}
        nextLabel="Ver mi tasación"
        nextDisabled={!canSubmit}
        loading={loading}
      />
    </StepShell>
  );
};

const Consent: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  required?: boolean;
  children: React.ReactNode;
}> = ({ checked, onChange, required, children }) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
    />
    <span className="text-xs text-slate-600 leading-relaxed">
      {children} {required && <span className="text-rose-500">*</span>}
    </span>
  </label>
);

export default StepContact;
