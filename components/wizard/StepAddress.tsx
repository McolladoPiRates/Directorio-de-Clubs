import React from 'react';
import { PROVINCES } from '../../constants';
import type { ValuationFormData } from '../../types';
import { isValidPostalCode } from '../../utils';
import { Field, NavButtons, StepShell, inputClass } from './shared';

interface Props {
  data: ValuationFormData;
  update: (patch: Partial<ValuationFormData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const StepAddress: React.FC<Props> = ({ data, update, onPrev, onNext }) => {
  const dir = data.direccion;
  const set = (patch: Partial<ValuationFormData['direccion']>) =>
    update({ direccion: { ...dir, ...patch } });

  const cpError = dir.codigoPostal && !isValidPostalCode(dir.codigoPostal) ? 'Introduce un código postal español de 5 dígitos.' : '';

  const canContinue = Boolean(dir.provincia && dir.ciudad && (!dir.codigoPostal || !cpError));

  return (
    <StepShell
      title="¿Dónde está la vivienda?"
      subtitle="La ubicación es el factor más importante para estimar el valor."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Provincia" required>
          <select
            className={inputClass}
            value={dir.provincia}
            onChange={(e) => set({ provincia: e.target.value })}
          >
            <option value="">Selecciona…</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Ciudad o municipio" required>
          <input
            className={inputClass}
            value={dir.ciudad}
            onChange={(e) => set({ ciudad: e.target.value })}
            placeholder="Ej. Madrid"
          />
        </Field>
        <Field label="Código postal" hint="Opcional, mejora la precisión" error={cpError}>
          <input
            className={inputClass}
            inputMode="numeric"
            maxLength={5}
            value={dir.codigoPostal}
            onChange={(e) => set({ codigoPostal: e.target.value.replace(/\D/g, '') })}
            placeholder="28001"
          />
        </Field>
        <Field label="Calle y número" hint="Opcional, no se muestra públicamente">
          <input
            className={inputClass}
            value={`${dir.calle}${dir.numero ? ' ' + dir.numero : ''}`}
            onChange={(e) => {
              const v = e.target.value;
              const m = v.match(/^(.*?)(?:\s+(\d+[\w-]*))?$/);
              set({ calle: m?.[1] || v, numero: m?.[2] || '' });
            }}
            placeholder="Ej. Calle Mayor 12"
          />
        </Field>
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextDisabled={!canContinue} />
    </StepShell>
  );
};

export default StepAddress;
