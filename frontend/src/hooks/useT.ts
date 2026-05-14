import { useApp } from '@/context/AppContext';
import type { I18NKey } from '@/data/i18n';

export function useT() {
  const { t, lang, fmtPrice, fmtNumber } = useApp();
  return { t: (k: I18NKey) => t(k), lang, fmtPrice, fmtNumber };
}
