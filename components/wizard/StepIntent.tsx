import React from 'react';
import { INTENTS, TIMEFRAMES } from '../../constants';
import type { ValuationFormData } from '../../types';
import { Field, NavButtons, OptionCard, StepShell, inputClass } from './shared';

interface Props {
  data: ValuationFormData;
  update: (patch: Partial<ValuationFormData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const StepIntent: React.FC<Props> = ({ data, update, onPrev, onNext }) => (
  <StepShell
    title="¿Para qué necesitas la tasación?"
    subtitle="Esto nos ayuda a personalizar los siguientes pasos. No te comprometes a nada."
  >
    <div className="grid sm:grid-cols-2 gap-3">
      {INTENTS.map((i) => (
        <OptionCard
          key={i.value}
          selected={data.intencion === i.value}
          onClick={() => update({ intencion: i.value })}
          title={i.label}
          description={i.description}
        />
      ))}
    </div>

    {(data.intencion === 'vender' || data.intencion === 'comprar_otra') && (
      <div className="mt-6">
        <Field label="¿En qué plazo te gustaría vender?">
          <select
            className={inputClass}
            value={data.plazo ?? ''}
            onChange={(e) => update({ plazo: (e.target.value || null) as ValuationFormData['plazo'] })}
          >
            <option value="">Selecciona…</option>
            {TIMEFRAMES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>
      </div>
    )}

    <NavButtons onPrev={onPrev} onNext={onNext} nextDisabled={!data.intencion} />
  </StepShell>
);

export default StepIntent;
