import React from 'react';
import { COMPANY_EMAIL, COMPANY_NAME } from '../constants';

type Slug = 'privacidad' | 'aviso' | 'cookies' | 'leads';

export const LEGAL_TITLES: Record<Slug, string> = {
  privacidad: 'Política de privacidad',
  aviso: 'Aviso legal',
  cookies: 'Política de cookies',
  leads: 'Tratamiento y cesión de datos a inmobiliarias',
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-5">
    <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
    <div className="text-slate-600">{children}</div>
  </section>
);

export const LegalContent: React.FC<{ slug: Slug }> = ({ slug }) => {
  if (slug === 'privacidad') {
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

        <Section title="1. Responsable del tratamiento">
          <p>{COMPANY_NAME}, con dirección de contacto <a href={`mailto:${COMPANY_EMAIL}`} className="underline">{COMPANY_EMAIL}</a>, es el responsable del tratamiento de los datos personales que recoge a través de esta web.</p>
        </Section>

        <Section title="2. Datos que recogemos">
          <ul className="list-disc pl-5 space-y-1">
            <li>Datos de la vivienda: tipo, dirección, superficie, características, estado y extras.</li>
            <li>Datos de contacto: nombre, apellidos, email y teléfono.</li>
            <li>Datos técnicos: dirección IP, navegador, parámetros UTM y página de origen.</li>
          </ul>
        </Section>

        <Section title="3. Finalidades">
          <ul className="list-disc pl-5 space-y-1">
            <li>Generar la estimación de valor de la vivienda y enviártela por email.</li>
            <li>Contactarte para ofrecerte una valoración presencial y servicios relacionados con la venta (solo si aceptas el consentimiento correspondiente).</li>
            <li>Compartir tus datos con inmobiliarias colaboradoras (solo si aceptas el consentimiento de cesión).</li>
            <li>Estadísticas internas y mejora del servicio.</li>
          </ul>
        </Section>

        <Section title="4. Base legal">
          <p>El tratamiento se basa en tu consentimiento (art. 6.1.a RGPD) y en la ejecución del servicio solicitado (art. 6.1.b RGPD). Cada cesión adicional requiere un consentimiento separado.</p>
        </Section>

        <Section title="5. Destinatarios">
          <p>Tus datos pueden ser compartidos con:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Inmobiliarias colaboradoras, únicamente si autorizas expresamente esta cesión.</li>
            <li>Proveedores tecnológicos que actúan como encargados del tratamiento (hosting, email transaccional, IA generativa para refinar la estimación). Estos proveedores solo tratan los datos siguiendo nuestras instrucciones.</li>
          </ul>
          <p className="mt-1">Algunos proveedores pueden ubicar servidores fuera del EEE; en esos casos exigimos garantías adecuadas (Cláusulas Contractuales Tipo de la Comisión Europea).</p>
        </Section>

        <Section title="6. Plazo de conservación">
          <p>Conservamos tus datos mientras estés interesado en el servicio y, posteriormente, durante los plazos legales de prescripción. Puedes solicitar su supresión en cualquier momento.</p>
        </Section>

        <Section title="7. Derechos">
          <p>Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento, portabilidad y a no ser objeto de decisiones automatizadas. Para ello, escribe a <a href={`mailto:${COMPANY_EMAIL}`} className="underline">{COMPANY_EMAIL}</a>. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
        </Section>

        <Section title="8. Decisiones automatizadas">
          <p>La estimación de valor se genera de forma automatizada combinando una heurística sobre precios medios de mercado con un modelo de IA. El resultado es orientativo y no produce efectos jurídicos en ti. Puedes solicitar revisión humana escribiéndonos.</p>
        </Section>
      </div>
    );
  }

  if (slug === 'aviso') {
    return (
      <div className="space-y-3">
        <Section title="Titular del sitio web">
          <p>{COMPANY_NAME}. Contacto: <a href={`mailto:${COMPANY_EMAIL}`} className="underline">{COMPANY_EMAIL}</a>.</p>
          <p className="mt-1 text-xs text-slate-500">Sustituye estos datos por la razón social, CIF y domicilio fiscal de la empresa antes de publicar.</p>
        </Section>
        <Section title="Objeto">
          <p>Esta web ofrece una herramienta gratuita de estimación orientativa del valor de mercado de viviendas situadas en España, basada en precios medios públicos y refinada mediante inteligencia artificial.</p>
        </Section>
        <Section title="No es tasación oficial">
          <p>La estimación NO es una tasación oficial conforme a la Orden ECO/805/2003 y no puede emplearse para finalidades hipotecarias, judiciales, fiscales ni regulatorias. Para esos fines necesitas una sociedad de tasación homologada por el Banco de España.</p>
        </Section>
        <Section title="Propiedad intelectual">
          <p>Los textos, gráficos, código y diseño de la web son propiedad de {COMPANY_NAME} o de sus licenciantes. Queda prohibida su reproducción sin autorización.</p>
        </Section>
        <Section title="Limitación de responsabilidad">
          <p>{COMPANY_NAME} no se responsabiliza de las decisiones que tomes basándote en la estimación. Aunque trabajamos para que los datos sean precisos, el mercado inmobiliario es dinámico y la valoración real depende de variables no contempladas en el formulario.</p>
        </Section>
      </div>
    );
  }

  if (slug === 'cookies') {
    return (
      <div className="space-y-3">
        <Section title="¿Qué son las cookies?">
          <p>Las cookies son pequeños archivos que un sitio web guarda en tu dispositivo para recordar información sobre tu visita.</p>
        </Section>
        <Section title="Cookies que utilizamos">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Técnicas (necesarias):</strong> almacenan tu progreso en el formulario y tu elección sobre el banner de cookies. No requieren consentimiento.</li>
            <li><strong>Analítica (opcional):</strong> nos permiten medir de forma agregada cómo se usa la web para mejorarla. Solo se activan si aceptas.</li>
          </ul>
        </Section>
        <Section title="Gestión y revocación">
          <p>Puedes revocar tu consentimiento en cualquier momento borrando las cookies de tu navegador o cambiando tu elección en el banner. Si bloqueas las cookies técnicas, el formulario puede no funcionar correctamente.</p>
        </Section>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Section title="Cesión de datos a inmobiliarias colaboradoras">
        <p>Una de las finalidades del servicio es poner en contacto a propietarios interesados en vender con inmobiliarias colaboradoras. Esa cesión es totalmente <strong>opcional</strong>: solo se realiza si marcas la casilla correspondiente en el formulario.</p>
      </Section>
      <Section title="¿Qué datos se ceden?">
        <ul className="list-disc pl-5 space-y-1">
          <li>Datos de la vivienda (tipo, ubicación, superficie, estado, extras).</li>
          <li>Rango de valor estimado por nuestra herramienta.</li>
          <li>Tus datos de contacto (nombre, email, teléfono).</li>
        </ul>
      </Section>
      <Section title="¿A qué inmobiliaria?">
        <p>Seleccionamos inmobiliarias colaboradoras con cobertura en la provincia que indiques. Antes del envío, te facilitaremos por email el nombre y los datos identificativos de la inmobiliaria que recibirá tus datos para que ejerzas tus derechos también frente a ella.</p>
      </Section>
      <Section title="Revocación del consentimiento">
        <p>Puedes revocar este consentimiento en cualquier momento escribiendo a <a href={`mailto:${COMPANY_EMAIL}`} className="underline">{COMPANY_EMAIL}</a>. La revocación no afecta a tratamientos anteriores basados en tu consentimiento.</p>
      </Section>
      <Section title="Modelo de negocio">
        <p>Nuestra empresa puede recibir una contraprestación económica de la inmobiliaria por el contacto cualificado. Esto no implica coste alguno para ti, ni te compromete a contratar ningún servicio con la inmobiliaria.</p>
      </Section>
    </div>
  );
};

export default LegalContent;
