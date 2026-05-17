import React from 'react';
import { CONDITIONS, ORIENTATIONS } from '../../constants';
import type { ValuationFormData } from '../../types';
import { Field, NavButtons, OptionCard, StepShell, inputClass } from './shared';

interface Props {
  data: ValuationFormData;
  update: (patch: Partial<ValuationFormData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const StepCondition: React.FC<Props> = ({ data, update, onPrev, onNext }) => (
  <StepShell title="Estado de la vivienda" subtitle="Esto influye mucho en el precio final.">
    <div className="grid sm:grid-cols-2 gap-3">
      {CONDITIONS.map((c) => (
        <OptionCard
          key={c.value}
          selected={data.estado === c.value}
          onClick={() => update({ estado: c.value })}
          title={c.label}
          description={c.description}
        />
      ))}
    </div>

    <div className="mt-6">
      <Field label="Orientación principal">
        <select
          className={inputClass}
          value={data.orientacion}
          onChange={(e) => update({ orientacion: e.target.value as ValuationFormData['orientacion'] })}
        >
          {ORIENTATIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>
    </div>

    <NavButtons onPrev={onPrev} onNext={onNext} nextDisabled={!data.estado} />
  </StepShell>
);

export default StepCondition;
