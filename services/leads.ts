import { LEAD_WEBHOOK_URL } from '../constants';
import type { LeadPayload, ValuationFormData, ValuationResult } from '../types';
import { parseUtm } from '../utils';

const LOCAL_STORAGE_KEY = 'tasador_leads_v1';

export const buildLead = (form: ValuationFormData, valuation: ValuationResult): LeadPayload => ({
  createdAt: new Date().toISOString(),
  form,
  valuation,
  utm: parseUtm(),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  referrer: typeof document !== 'undefined' ? document.referrer : '',
});

const persistLocal = (lead: LeadPayload) => {
  try {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: LeadPayload[] = raw ? JSON.parse(raw) : [];
    list.push(lead);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list.slice(-50)));
  } catch (err) {
    console.warn('[leads] No se pudo guardar el lead en localStorage:', err);
  }
};

const sendWebhook = async (lead: LeadPayload): Promise<boolean> => {
  if (!LEAD_WEBHOOK_URL) return false;
  try {
    const res = await fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      mode: 'cors',
    });
    return res.ok;
  } catch (err) {
    console.warn('[leads] Webhook falló:', err);
    return false;
  }
};

export const submitLead = async (lead: LeadPayload): Promise<{ ok: boolean; webhookOk: boolean }> => {
  persistLocal(lead);
  const webhookOk = await sendWebhook(lead);
  if (!LEAD_WEBHOOK_URL) {
    console.info('[leads] LEAD_WEBHOOK_URL no configurado. Lead guardado solo en localStorage. Payload:', lead);
  }
  return { ok: true, webhookOk };
};

export const readLocalLeads = (): LeadPayload[] => {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
