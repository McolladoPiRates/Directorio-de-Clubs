import React from 'react';
import * as Icons from 'lucide-react';
import { PROPERTY_TYPES } from '../../constants';
import type { ValuationFormData } from '../../types';
import { NavButtons, OptionCard, StepShell } from './shared';

interface Props {
  data: ValuationFormData;
  update: (patch: Partial<ValuationFormData>) => void;
  onNext: () => void;
}

const StepPropertyType: React.FC<Props> = ({ data, update, onNext }) => (
  <StepShell
    title="¿Qué tipo de vivienda quieres tasar?"
    subtitle="Elige la opción que mejor describe tu inmueble."
  >
    <div className="grid sm:grid-cols-2 gap-3">
      {PROPERTY_TYPES.map((t) => {
        const Icon = (Icons as any)[t.icon] || Icons.Home;
        return (
          <OptionCard
            key={t.value}
            selected={data.tipo === t.value}
            onClick={() => update({ tipo: t.value })}
            title={t.label}
            description={t.description}
            icon={<Icon size={18} />}
          />
        );
      })}
    </div>
    <NavButtons onNext={onNext} nextDisabled={!data.tipo} showPrev={false} />
  </StepShell>
);

export default StepPropertyType;
