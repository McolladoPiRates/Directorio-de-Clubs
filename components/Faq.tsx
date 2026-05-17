import React from 'react';
import { ChevronDown } from 'lucide-react';
import { COMPANY_EMAIL, COMPANY_NAME } from '../constants';

const faqs: { q: string; a: string }[] = [
  {
    q: '¿Cuánto cuesta tasar mi vivienda?',
    a: 'Es completamente gratis y sin compromiso. Solo te pediremos algunos datos para calcular la estimación y enviártela.',
  },
  {
    q: '¿La tasación tiene validez oficial?',
    a: 'No. Es una estimación de valor de mercado con fines orientativos. Para procesos hipotecarios, judiciales o fiscales necesitas una tasación realizada por una sociedad de tasación homologada por el Banco de España, conforme a la Orden ECO/805/2003.',
  },
  {
    q: '¿Por qué necesitáis mis datos de contacto?',
    a: 'Para enviarte el informe de tasación al email y, si lo autorizas, para que una inmobiliaria colaboradora pueda contactarte con una valoración presencial y propuestas comerciales. Tú decides qué autorizas en cada paso.',
  },
  {
    q: '¿Qué hacéis con mi información?',
    a: `Tratamos tus datos según el RGPD y la LOPDGDD. ${COMPANY_NAME} es el responsable del tratamiento. Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad.`,
  },
  {
    q: '¿Cómo de fiable es la estimación de la IA?',
    a: 'La estimación se basa en precios medios por provincia y en los datos que tú declaras. Sirve como punto de partida, pero el valor real depende del estado real del inmueble, la demanda exacta del barrio y otras variables que requieren visita presencial.',
  },
  {
    q: '¿Puedo borrar mis datos después?',
    a: `Sí. Escríbenos a ${COMPANY_EMAIL} y eliminaremos tu información del sistema en un plazo máximo de 30 días.`,
  },
];

const Faq: React.FC = () => {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="preguntas" className="py-16 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide">Preguntas frecuentes</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Resolvemos tus dudas</h2>
        </div>
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl bg-white overflow-hidden">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-slate-50 transition"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-slate-900">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
