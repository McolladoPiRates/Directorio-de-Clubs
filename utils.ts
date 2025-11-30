
export const toNum = (val: any): number => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isFinite(val) ? val : 0;
  const str = String(val).replace(',', '.').replace('%', '').trim();
  const num = parseFloat(str);
  return isFinite(num) ? num : 0;
};

export const toStr = (val: any): string => {
  return val ? String(val).trim() : '';
};

export const toDateStr = (val: any): string => {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString();
  return String(val);
};
