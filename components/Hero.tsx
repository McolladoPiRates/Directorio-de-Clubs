import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Clock3 } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const Hero: React.FC<Props> = ({ onStart }) => (
  <section id="top" className="hero-gradient">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
      <div className="animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm mb-5">
          <Sparkles size={14} className="text-brand-600" />
          Tasación con IA · 100% online · Gratuita
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          ¿Cuánto vale tu vivienda hoy?
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-xl">
          Recibe en menos de 2 minutos una estimación del valor de mercado de tu casa o piso,
          basada en datos reales del mercado español y refinada con inteligencia artificial.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-brand-600 text-white font-semibold text-base shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition"
          >
            Tasar mi vivienda gratis
            <ArrowRight size={18} />
          </button>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center px-6 py-4 rounded-full border border-slate-200 text-slate-700 font-semibold hover:bg-white transition"
          >
            ¿Cómo funciona?
          </a>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
          <li className="inline-flex items-center gap-2">
            <ShieldCheck size={16} className="text-accent-500" /> Datos cifrados
          </li>
          <li className="inline-flex items-center gap-2">
            <Clock3 size={16} className="text-accent-500" /> Resultado en 2 min
          </li>
          <li className="inline-flex items-center gap-2">
            <Sparkles size={16} className="text-accent-500" /> Sin compromiso
          </li>
        </ul>
      </div>

      <div className="relative animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Tu tasación estimada</div>
              <div className="text-xs text-slate-500">Vista previa</div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Rango estimado</div>
              <div className="mt-1 text-3xl font-extrabold text-slate-900">285.000 € – 340.000 €</div>
              <div className="text-sm text-slate-500">Valor central: 312.000 €</div>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-brand-500 to-accent-500" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">€/m²</div>
                <div className="text-sm font-semibold text-slate-900">3.470</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Demanda</div>
                <div className="text-sm font-semibold text-slate-900">Alta</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-[11px] text-slate-500">Confianza</div>
                <div className="text-sm font-semibold text-slate-900">Media</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vista de ejemplo. La estimación real depende de los datos que indiques. No sustituye una tasación oficial.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 hidden sm:block">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-lg">
            <Sparkles size={12} /> Powered by Gemini
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
