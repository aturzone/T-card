import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { t as translate, fmtPrice as formatPrice, fmtNumber as formatNumber } from '@/data/format';
import type { I18NKey } from '@/data/i18n';
import type { CartItem, Lang } from '@/data/types';

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;

  cart: CartItem[];
  addToCart: (entry: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, q: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  toastMsg: string;
  toastShow: boolean;
  showToast: (msg: string) => void;

  t: (key: I18NKey) => string;
  fmtPrice: (n: number) => string;
  fmtNumber: (n: number) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useLocalStorage<Lang>('tcard.lang', 'en');
  const [cart, setCart] = useLocalStorage<CartItem[]>('tcard.cart', []);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: '', show: false });

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), [setLangState]);

  const addToCart = useCallback((entry: Omit<CartItem, 'id'>) => {
    setCart((prev) => [...prev, { ...entry, id: 'i_' + Math.random().toString(36).slice(2, 9) }]);
    setCartOpen(true);
  }, [setCart]);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, [setCart]);

  const updateQty = useCallback((id: string, q: number) => {
    if (q <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: q } : i)));
  }, [setCart]);

  const clearCart = useCallback(() => setCart([]), [setCart]);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, show: true });
    window.setTimeout(() => setToast({ msg: '', show: false }), 2400);
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    lang, setLang,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    cartOpen, openCart, closeCart,
    toastMsg: toast.msg,
    toastShow: toast.show,
    showToast,
    t: (key) => translate(key, lang),
    fmtPrice: (n) => formatPrice(n, lang),
    fmtNumber: (n) => formatNumber(n, lang),
  }), [lang, setLang, cart, addToCart, removeFromCart, updateQty, clearCart, cartOpen, openCart, closeCart, toast.msg, toast.show, showToast]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
