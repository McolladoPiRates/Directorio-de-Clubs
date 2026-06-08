import React from 'react';
import { Check } from 'lucide-react';
import type { Extras, PropertyType, ValuationFormData } from '../../types';
import { NavButtons, StepShell } from './shared';

interface Props {
  data: ValuationFormData;
  update: (patch: Partial<ValuationFormData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const ALL_OPTIONS: { key: keyof Extras; label: string }[] = [
  { key: 'ascensor', label: 'Ascensor' },
  { key: 'parking', label: 'Plaza de parking' },
  { key: 'trastero', label: 'Trastero' },
  { key: 'terraza', label: 'Terraza' },
  { key: 'balcon', label: 'Balcón' },
  { key: 'jardin', label: 'Jardín privado' },
  { key: 'piscina', label: 'Piscina' },
  { key: 'aireAcondicionado', label: 'Aire acondicionado' },
  { key: 'calefaccion', label: 'Calefacción' },
];

const FLAT_TYPES: PropertyType[] = ['piso', 'atico', 'duplex', 'estudio'];
const HOUSE_TYPES: PropertyType[] = ['casa_adosada', 'chalet', 'casa_rural'];

const optionsForType = (tipo: PropertyType | null): (keyof Extras)[] => {
  if (tipo && HOUSE_TYPES.includes(tipo)) {
    return ['parking', 'trastero', 'terraza', 'jardin', 'piscina', 'aireAcondicionado', 'calefaccion'];
  }
  if (tipo && FLAT_TYPES.includes(tipo)) {
    return ['ascensor', 'parking', 'trastero', 'terraza', 'balcon', 'aireAcondicionado', 'calefaccion'];
  }
  return ALL_OPTIONS.map((o) => o.key);
};

const StepExtras: React.FC<Props> = ({ data, update, onPrev, onNext }) => {
  const toggle = (key: keyof Extras) =>
    update({ extras: { ...data.extras, [key]: !data.extras[key] } });

  const visible = optionsForType(data.tipo);
  const options = ALL_OPTIONS.filter((o) => visible.includes(o.key));

  React.useEffect(() => {
    const cleaned: Extras = { ...data.extras };
    let changed = false;
    (Object.keys(cleaned) as (keyof Extras)[]).forEach((k) => {
      if (!visible.includes(k) && cleaned[k]) {
        cleaned[k] = false;
        changed = true;
      }
    });
    if (changed) update({ extras: cleaned });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.tipo]);

  return (
    <StepShell
      title="Extras y calidades"
      subtitle="Marca todo lo que tiene tu vivienda. Puedes saltar si no aplica."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {options.map((opt) => {
          const active = data.extras[opt.key];
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => toggle(opt.key)}
              className={[
                'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition text-left',
                active
                  ? 'border-brand-600 bg-brand-50 text-brand-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300',
              ].join(' ')}
            >
              <span
                className={[
                  'w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0',
                  active ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white',
                ].join(' ')}
              >
                {active && <Check size={12} />}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
      <NavButtons onPrev={onPrev} onNext={onNext} />
    </StepShell>
  );
};

export default StepExtras;
