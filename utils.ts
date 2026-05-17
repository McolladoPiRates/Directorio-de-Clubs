export const formatEur = (n: number): string => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatNumber = (n: number, decimals = 0): string => {
  if (!isFinite(n)) return '—';
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
};

export const parseUtm = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
};

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidSpanishPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^(\+?\d{1,3})?[6789]\d{8}$/.test(cleaned);
};

export const isValidPostalCode = (cp: string): boolean => /^\d{5}$/.test(cp.trim());
