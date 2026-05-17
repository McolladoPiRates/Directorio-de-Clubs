import React from 'react';
import { ClipboardList, Cpu, Mail, ShieldCheck, MapPin, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Cuéntanos cómo es tu vivienda',
    text: 'Tipo, superficie, ubicación, estado y características en menos de 2 minutos.',
  },
  {
    icon: Cpu,
    title: 'Nuestra IA la valora',
    text: 'Cruzamos los datos con precios medios por provincia y ajustamos con un modelo de IA.',
  },
  {
    icon: Mail,
    title: 'Recibe el rango por email',
    text: 'Ves el valor estimado al instante y te lo enviamos también a tu correo.',
  },
];

const pillars = [
  { icon: MapPin, title: 'Datos del mercado español', text: 'Precio medio por provincia y por tipología de vivienda.' },
  { icon: BarChart3, title: 'Algoritmo transparente', text: 'Mostramos el desglose de cada ajuste sobre el precio base.' },
  { icon: ShieldCheck, title: 'Privacidad por diseño', text: 'Cumplimos RGPD y solo compartimos tus datos si lo autorizas.' },
];

const HowItWorks: React.FC = () => (
  <>
    <section id="como-funciona" className="py-16 sm:py-20 border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide">Cómo funciona</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Tasación online en 3 pasos sencillos
          </h2>
          <p className="mt-3 text-slate-600">
            Sin descargas, sin compromiso y sin visitas. Solo el tiempo que tardas en responder unas preguntas.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition">
              <div className="absolute -top-3 left-6 inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold">
                {i + 1}
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <s.icon size={18} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{s.title}</h3>
              <p className="text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="por-que" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <div key={p.title} className="rounded-2xl bg-white p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-600 flex items-center justify-center mb-4">
              <p.icon size={18} />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{p.title}</h3>
            <p className="text-sm text-slate-600">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default HowItWorks;
