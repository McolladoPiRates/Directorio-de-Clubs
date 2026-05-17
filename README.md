# Tasador IA de Vivienda

Web de tasación online de viviendas con IA para captación de leads cualificados que después se ofrecen a inmobiliarias colaboradoras.

Inspirada en [realadvisor.es](https://realadvisor.es/es/tasacion-vivienda-online).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS (CDN)
- `@google/genai` (Gemini 2.5 Flash) para refinar la estimación
- Heurística determinista basada en precio medio €/m² por provincia como base
- Iconos: lucide-react
- Persistencia de leads: localStorage + webhook configurable

## Estructura

```
App.tsx                            Layout: Header + Hero + Wizard + How + FAQ + Footer
components/
  Header.tsx / Hero.tsx / HowItWorks.tsx / Faq.tsx / Footer.tsx
  CookieBanner.tsx / Modal.tsx / LegalContent.tsx / ProgressBar.tsx
  wizard/
    Wizard.tsx              Orquesta los 7 pasos + resultado
    StepPropertyType.tsx    1. Tipo
    StepAddress.tsx         2. Ubicación
    StepBasics.tsx          3. Superficie, distribución, año, planta
    StepCondition.tsx       4. Estado + orientación
    StepExtras.tsx          5. Extras (ascensor, parking, etc.)
    StepIntent.tsx          6. Motivo y plazo
    StepContact.tsx         7. Datos de contacto + consentimientos RGPD
    StepResult.tsx          Resultado + disclaimer + lead enviado
services/
  valuation.ts              Heurística + refinamiento Gemini
  leads.ts                  Persistencia local + envío a webhook
types.ts / constants.ts / utils.ts
```

## Variables de entorno

Crea un fichero `.env.local`:

```bash
GEMINI_API_KEY=...           # Clave de Google AI Studio. Sin ella, la app cae a heurística.
LEAD_WEBHOOK_URL=...         # URL que recibirá POST JSON con cada lead. Vacío = solo localStorage.
COMPANY_NAME=Tu Marca SL
COMPANY_EMAIL=hola@tu-marca.com
```

## Desarrollo

```bash
npm install
npm run dev
```

## Modelo de captación de leads

Cada formulario completado genera un payload `LeadPayload`:

```ts
{
  createdAt: string,
  form: ValuationFormData,     // todos los datos de la vivienda + contacto + consentimientos
  valuation: ValuationResult,  // rango estimado, €/m², confianza, fuente (heuristic|gemini)
  utm: { utm_source, utm_medium, utm_campaign, ... },
  userAgent, referrer
}
```

Que se envía por `POST application/json` a `LEAD_WEBHOOK_URL` (Zapier, Make, HubSpot, n8n, etc.) y se guarda también en `localStorage` (`tasador_leads_v1`).

La cesión a inmobiliarias requiere consentimiento explícito separado en el paso 7 y está documentada en la página legal "Tratamiento y cesión de datos".

## Cumplimiento legal

- Banner de cookies con elección granular.
- Política de privacidad, aviso legal, política de cookies y página específica de cesión a inmobiliarias accesibles desde el footer.
- Disclaimer permanente: la estimación NO es tasación oficial (Orden ECO/805/2003).
- Mención de la naturaleza parcialmente automatizada del proceso conforme al art. 22 RGPD.

Antes de publicar:

1. Sustituye razón social, NIF, dirección y email en `LegalContent.tsx` y en las variables de entorno.
2. Revisa los precios medios `€/m²` por provincia en `constants.ts` con los datos públicos más recientes.
3. Configura `LEAD_WEBHOOK_URL` apuntando a tu CRM real.
