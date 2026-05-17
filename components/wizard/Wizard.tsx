import React from 'react';
import ProgressBar from '../ProgressBar';
import StepPropertyType from './StepPropertyType';
import StepAddress from './StepAddress';
import StepBasics from './StepBasics';
import StepCondition from './StepCondition';
import StepExtras from './StepExtras';
import StepIntent from './StepIntent';
import StepContact from './StepContact';
import StepResult from './StepResult';
import { computeValuation } from '../../services/valuation';
import { buildLead, submitLead } from '../../services/leads';
import type { ValuationFormData, ValuationResult } from '../../types';

const STORAGE_KEY = 'tasador_form_v1';

const emptyForm: ValuationFormData = {
  tipo: null,
  direccion: { calle: '', numero: '', codigoPostal: '', ciudad: '', provincia: '' },
  metrosConstruidos: null,
  metrosUtiles: null,
  dormitorios: null,
  banos: null,
  anoConstruccion: null,
  planta: null,
  orientacion: 'no_se',
  estado: null,
  extras: {
    ascensor: false,
    parking: false,
    trastero: false,
    terraza: false,
    balcon: false,
    jardin: false,
    piscina: false,
    aireAcondicionado: false,
    calefaccion: false,
  },
  intencion: null,
  plazo: null,
  contacto: { nombre: '', apellidos: '', email: '', telefono: '', prefijo: '+34' },
  consentimientos: { privacidad: false, comerciales: false, cesionInmobiliarias: false },
};

const TOTAL_STEPS = 7;

interface Props {
  onLegal: (slug: 'privacidad' | 'aviso' | 'cookies' | 'leads') => void;
}

const Wizard: React.FC<Props> = ({ onLegal }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<ValuationFormData>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...emptyForm, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    return emptyForm;
  });
  const [loading, setLoading] = React.useState(false);
  const [valuation, setValuation] = React.useState<ValuationResult | null>(null);
  const [webhookOk, setWebhookOk] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    try {
      const { contacto, consentimientos, ...persistable } = data;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      /* ignore */
    }
  }, [data]);

  const update = (patch: Partial<ValuationFormData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const next = () => {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => {
    setStep((s) => Math.max(0, s - 1));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await computeValuation(data);
      const lead = buildLead(data, result);
      const { webhookOk: ok } = await submitLead(lead);
      setValuation(result);
      setWebhookOk(ok);
      setStep(TOTAL_STEPS);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('No hemos podido generar la tasación. Inténtalo de nuevo en unos segundos.');
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setData(emptyForm);
    setValuation(null);
    setWebhookOk(false);
    setStep(0);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isResult = step === TOTAL_STEPS && valuation;

  return (
    <section id="wizard" className="py-12 sm:py-16 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-8">
          {!isResult && (
            <div className="mb-6">
              <ProgressBar current={step} total={TOTAL_STEPS} />
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm px-4 py-3">
              {error}
            </div>
          )}

          {step === 0 && (
            <StepPropertyType data={data} update={update} onNext={next} />
          )}
          {step === 1 && (
            <StepAddress data={data} update={update} onPrev={prev} onNext={next} />
          )}
          {step === 2 && (
            <StepBasics data={data} update={update} onPrev={prev} onNext={next} />
          )}
          {step === 3 && (
            <StepCondition data={data} update={update} onPrev={prev} onNext={next} />
          )}
          {step === 4 && (
            <StepExtras data={data} update={update} onPrev={prev} onNext={next} />
          )}
          {step === 5 && (
            <StepIntent data={data} update={update} onPrev={prev} onNext={next} />
          )}
          {step === 6 && (
            <StepContact
              data={data}
              update={update}
              onPrev={prev}
              onSubmit={submit}
              loading={loading}
              onLegal={onLegal}
            />
          )}
          {isResult && (
            <StepResult
              data={data}
              valuation={valuation!}
              webhookOk={webhookOk}
              onRestart={restart}
              onLegal={onLegal}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Wizard;
