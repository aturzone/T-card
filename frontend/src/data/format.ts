import { I18N, type I18NKey } from './i18n';
import type { Lang } from './types';

export function t(key: I18NKey, lang: Lang): string {
  const e = I18N[key];
  if (!e) return key;
  return e[lang] || e.en;
}

export function fmtPrice(amountUSD: number, lang: Lang): string {
  if (lang === 'fa') {
    const tmn = amountUSD * 50;
    return `${tmn.toLocaleString('fa-IR')} هزار تومان`;
  }
  return `$${amountUSD.toLocaleString('en-US')}`;
}

export function fmtNumber(n: number, lang: Lang): string {
  return n.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US');
}
