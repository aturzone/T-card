export type Lang = 'en' | 'fa';

export interface LocalizedString {
  en: string;
  fa: string;
}

export interface Category {
  id: string;
  en: string;
  fa: string;
}

export interface Brand {
  id: string;
  cat: string;
  name: LocalizedString;
  initial: string;
  tagline: LocalizedString;
  description: LocalizedString;
  palette: { a: string; b: string; accent: string };
  amounts: number[];
  rating: number;
  reviews: number;
}

export interface Testimonial {
  quote: LocalizedString;
  name: LocalizedString;
  role: LocalizedString;
}

export interface Faq {
  q: LocalizedString;
  a: LocalizedString;
}

export interface CartItem {
  id: string;
  brandId: string;
  amount: number;
  qty: number;
  recipient: string | null;
  recipientEmail: string | null;
  message: string;
  deliveryDate: string | null;
}

export interface Order {
  id: string;
  total: number;
  fee: number;
  subtotal: number;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    pay: string;
    cardExp?: string;
    cardName?: string;
  };
  placedAt: number;
}
