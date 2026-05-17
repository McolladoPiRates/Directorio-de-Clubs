import React from 'react';
import type { ValuationFormData } from '../../types';
import { Field, NavButtons, StepShell, inputClass } from './shared';

interface Props {
  data: ValuationFormData;
  update: (patch: Partial<ValuationFormData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const numOrNull = (v: string): number | null => {
  if (v === '') return null;
  const n = Number(v.replace(',', '.'));
  return isFinite(n) ? n : null;
};

const StepBasics: React.FC<Props> = ({ data, update, onPrev, onNext }) => {
  const currentYear = new Date().getFullYear();
  const m2 = data.metrosConstruidos;
  const canContinue = Boolean(m2 && m2 >= 15 && m2 <= 2000);

  return (
    <StepShell
      title="Características básicas"
      subtitle="Indica al menos la superficie. El resto nos ayuda a afinar el cálculo."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Superficie construida (m²)" required hint="Es la que aparece en escrituras">
          <input
            className={inputClass}
            inputMode="numeric"
            value={m2 ?? ''}
            onChange={(e) => update({ metrosConstruidos: numOrNull(e.target.value) })}
            placeholder="Ej. 95"
          />
        </Field>
        <Field label="Superficie útil (m²)" hint="Opcional">
          <input
            className={inputClass}
            inputMode="numeric"
            value={data.metrosUtiles ?? ''}
            onChange={(e) => update({ metrosUtiles: numOrNull(e.target.value) })}
            placeholder="Ej. 80"
          />
        </Field>
        <Field label="Dormitorios">
          <input
            className={inputClass}
            inputMode="numeric"
            value={data.dormitorios ?? ''}
            onChange={(e) => update({ dormitorios: numOrNull(e.target.value) })}
            placeholder="Ej. 3"
          />
        </Field>
        <Field label="Baños">
          <input
            className={inputClass}
            inputMode="numeric"
            value={data.banos ?? ''}
            onChange={(e) => update({ banos: numOrNull(e.target.value) })}
            placeholder="Ej. 2"
          />
        </Field>
        <Field label="Año de construcción" hint={`Entre 1850 y ${currentYear}`}>
          <input
            className={inputClass}
            inputMode="numeric"
            value={data.anoConstruccion ?? ''}
            onChange={(e) => update({ anoConstruccion: numOrNull(e.target.value) })}
            placeholder="Ej. 1995"
          />
        </Field>
        <Field label="Planta" hint="0 = planta baja. Deja vacío si es casa.">
          <input
            className={inputClass}
            inputMode="numeric"
            value={data.planta ?? ''}
            onChange={(e) => update({ planta: numOrNull(e.target.value) })}
            placeholder="Ej. 4"
          />
        </Field>
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextDisabled={!canContinue} />
    </StepShell>
  );
};

export default StepBasics;
