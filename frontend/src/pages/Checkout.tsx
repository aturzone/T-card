import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { GCard } from '@/components/product/GCard';
import { BRANDS } from '@/data/brands';
import type { Order } from '@/data/types';

interface FormState {
  name: string;
  email: string;
  phone: string;
  cardNum: string;
  cardExp: string;
  cardCvc: string;
  cardName: string;
  pay: 'card' | 'wallet' | 'crypto';
}

interface PaymentOption {
  id: 'card' | 'wallet' | 'crypto';
  name: string;
  desc: string;
  icon: ReactNode;
}

export function Checkout() {
  const { lang, t, fmtPrice, fmtNumber, cart, clearCart } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    name: '', email: '', phone: '',
    cardNum: '', cardExp: '', cardCvc: '', cardName: '',
    pay: 'card',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const fee = subtotal * 0.02;
  const total = subtotal + fee;

  if (cart.length === 0) {
    return (
      <main className="page container-x text-center" style={{ paddingBlock: 'clamp(60px, 10vw, 140px)' }}>
        <div className="font-display" style={{ fontSize: 'var(--fs-h2)', marginBottom: 12 }}>{t('cart_empty')}</div>
        <p className="text-ink-soft" style={{ marginBottom: 30 }}>{t('cart_empty_d')}</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>{t('shop_now')}</button>
      </main>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.name || form.name.length < 2) e.name = lang === 'fa' ? 'الزامی' : 'Required';
      if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = lang === 'fa' ? 'ایمیل نامعتبر' : 'Invalid email';
      if (!form.phone || form.phone.length < 6) e.phone = lang === 'fa' ? 'الزامی' : 'Required';
    }
    if (step === 2 && form.pay === 'card') {
      if (!form.cardNum || form.cardNum.replace(/\s/g, '').length < 14) e.cardNum = lang === 'fa' ? 'شماره کارت نامعتبر' : 'Invalid card';
      if (!form.cardExp || !/^\d{2}\/\d{2}$/.test(form.cardExp)) e.cardExp = lang === 'fa' ? 'MM/YY' : 'MM/YY';
      if (!form.cardCvc || form.cardCvc.length < 3) e.cardCvc = lang === 'fa' ? '۳ رقم' : '3 digits';
      if (!form.cardName) e.cardName = lang === 'fa' ? 'الزامی' : 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const place = () => {
    setPlacing(true);
    setTimeout(() => {
      const orderId = 'TC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const orders: Order[] = JSON.parse(localStorage.getItem('tcard.orders') || '[]');
      orders.unshift({
        id: orderId,
        total, fee, subtotal,
        items: cart.slice(),
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          pay: form.pay,
          cardExp: form.cardExp || undefined,
          cardName: form.cardName || undefined,
        },
        placedAt: Date.now(),
      });
      localStorage.setItem('tcard.orders', JSON.stringify(orders));
      clearCart();
      navigate('/confirmation/' + orderId);
    }, 1400);
  };

  const formatCard = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const payOptions: PaymentOption[] = [
    {
      id: 'card',
      name: t('pay_card'),
      desc: t('pay_card_d'),
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2" y="6" width="20" height="13" rx="2" />
          <path d="M2 11h20M6 16h3" />
        </svg>
      ),
    },
    {
      id: 'wallet',
      name: t('pay_wallet'),
      desc: t('pay_wallet_d'),
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M21 8H6a3 3 0 0 1 0-6h12v6m3 0v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5m17 7h-3a2 2 0 0 0 0 4h3" />
        </svg>
      ),
    },
    {
      id: 'crypto',
      name: t('pay_crypto'),
      desc: t('pay_crypto_d'),
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 8h4.5a2 2 0 0 1 0 4H9m0 0h5a2 2 0 0 1 0 4H9V8z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(30px, 4vw, 60px)' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop')} style={{ marginBottom: 24 }}>
        <Icon.ArrowLeft /> {t('back')}
      </button>
      <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginBottom: 8 }}>{t('checkout')}</h1>

      <div className="flex gap-3" style={{ marginBottom: 48 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} className={`cstep ${step === n ? 'active' : ''} ${step > n ? 'done' : ''}`}>
            <div className="bar" />
            <div className="label">
              <span>{lang === 'fa' ? ['۰۱', '۰۲', '۰۳'][n - 1] : `0${n}`}</span>
              <span>{n === 1 ? t('step_details') : n === 2 ? t('step_payment') : t('step_review')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid checkout-grid gap-[60px]" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div>
          {step === 1 && (
            <Reveal>
              <h2 className="font-display" style={{ fontSize: 28, marginBottom: 24 }}>{t('step_details')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="field" style={{ gridColumn: '1/-1' }}>
                  <label>{t('f_name')}</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={lang === 'fa' ? 'نام کامل' : 'Full name'} />
                  {errors.name && <span className="err">{errors.name}</span>}
                </div>
                <div className="field">
                  <label>{t('f_email')}</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  {errors.email && <span className="err">{errors.email}</span>}
                </div>
                <div className="field">
                  <label>{t('f_phone')}</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 123 4567" />
                  {errors.phone && <span className="err">{errors.phone}</span>}
                </div>
              </div>
            </Reveal>
          )}

          {step === 2 && (
            <Reveal>
              <h2 className="font-display" style={{ fontSize: 28, marginBottom: 24 }}>{t('step_payment')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: 28 }}>
                {payOptions.map((m) => (
                  <button
                    key={m.id}
                    className={`pay-method ${form.pay === m.id ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, pay: m.id })}
                  >
                    <div className="flex items-center gap-2.5">
                      {m.icon}
                      <span className="pay-method-name">{m.name}</span>
                    </div>
                    <span className="pay-method-desc">{m.desc}</span>
                  </button>
                ))}
              </div>

              {form.pay === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="field" style={{ gridColumn: '1/-1' }}>
                    <label>{t('f_card_num')}</label>
                    <input value={form.cardNum} onChange={(e) => setForm({ ...form, cardNum: formatCard(e.target.value) })} placeholder="4242 4242 4242 4242" inputMode="numeric" />
                    {errors.cardNum && <span className="err">{errors.cardNum}</span>}
                  </div>
                  <div className="field" style={{ gridColumn: '1/-1' }}>
                    <label>{lang === 'fa' ? 'نام روی کارت' : 'Name on card'}</label>
                    <input value={form.cardName} onChange={(e) => setForm({ ...form, cardName: e.target.value })} placeholder={form.name || (lang === 'fa' ? 'نام کامل' : 'Full name')} />
                    {errors.cardName && <span className="err">{errors.cardName}</span>}
                  </div>
                  <div className="field">
                    <label>{t('f_exp')}</label>
                    <input value={form.cardExp} onChange={(e) => setForm({ ...form, cardExp: formatExp(e.target.value) })} placeholder="12/27" inputMode="numeric" />
                    {errors.cardExp && <span className="err">{errors.cardExp}</span>}
                  </div>
                  <div className="field">
                    <label>{t('f_cvc')}</label>
                    <input value={form.cardCvc} onChange={(e) => setForm({ ...form, cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" inputMode="numeric" />
                    {errors.cardCvc && <span className="err">{errors.cardCvc}</span>}
                  </div>
                </div>
              )}

              {form.pay === 'wallet' && (
                <div className="text-center border border-line bg-bg-card" style={{ padding: 32, borderRadius: 'var(--radius)' }}>
                  <p className="text-ink-soft">{lang === 'fa' ? 'پس از تایید سفارش، به درگاه کیف پول هدایت می‌شوید.' : "You'll be redirected to your wallet provider after placing the order."}</p>
                </div>
              )}

              {form.pay === 'crypto' && (
                <div className="text-center border border-line bg-bg-card" style={{ padding: 32, borderRadius: 'var(--radius)' }}>
                  <p className="text-ink-soft">{lang === 'fa' ? 'پس از تایید سفارش، آدرس کیف پول و کد QR نمایش داده می‌شود.' : 'A QR code and wallet address will appear after placing the order.'}</p>
                </div>
              )}

              <div className="inline-flex items-center gap-2 text-ink-mute font-mono text-[12px]" style={{ marginTop: 24 }}>
                <Icon.Shield /> {lang === 'fa' ? '256-bit رمزنگاری · PCI-DSS' : '256-bit encrypted · PCI-DSS L1'}
              </div>
            </Reveal>
          )}

          {step === 3 && (
            <Reveal>
              <h2 className="font-display" style={{ fontSize: 28, marginBottom: 24 }}>{t('step_review')}</h2>
              <div className="border border-line bg-bg-card" style={{ padding: 24, borderRadius: 'var(--radius)', marginBottom: 20 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{t('step_details')}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px]">
                  <div><span className="text-ink-mute">{t('f_name')}: </span>{form.name}</div>
                  <div><span className="text-ink-mute">{t('f_email')}: </span>{form.email}</div>
                  <div><span className="text-ink-mute">{t('f_phone')}: </span>{form.phone}</div>
                </div>
              </div>
              <div className="border border-line bg-bg-card" style={{ padding: 24, borderRadius: 'var(--radius)', marginBottom: 20 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{t('step_payment')}</div>
                <div className="text-[14px]">
                  {form.pay === 'card' && <span>{t('pay_card')} •••• {form.cardNum.slice(-4)}</span>}
                  {form.pay === 'wallet' && <span>{t('pay_wallet')}</span>}
                  {form.pay === 'crypto' && <span>{t('pay_crypto')}</span>}
                </div>
              </div>
              <div className="border border-line bg-bg-card" style={{ padding: 24, borderRadius: 'var(--radius)' }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{t('cart')}</div>
                {cart.map((item) => {
                  const brand = BRANDS.find((b) => b.id === item.brandId);
                  if (!brand) return null;
                  return (
                    <div key={item.id} className="flex justify-between text-[14px]" style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                      <span>{brand.name[lang] || brand.name.en} × {fmtNumber(item.qty)}</span>
                      <span className="font-mono">{fmtPrice(item.amount * item.qty)}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          )}

          <div className="flex justify-between gap-3" style={{ marginTop: 40 }}>
            {step > 1 ? <button className="btn btn-ghost" onClick={back}><Icon.ArrowLeft /> {t('back')}</button> : <span />}
            {step < 3 ? (
              <button className="btn btn-primary btn-lg" onClick={next}>{t('continue')} <Icon.Arrow /></button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={place} disabled={placing}>
                {placing ? (lang === 'fa' ? 'در حال پردازش…' : 'Processing…') : (
                  <>{t('pay_now')} · {fmtPrice(total)}</>
                )}
              </button>
            )}
          </div>
        </div>

        <aside>
          <div className="sticky top-[100px] border border-line bg-bg-card" style={{ padding: 28, borderRadius: 'var(--radius-lg)' }}>
            <div className="eyebrow" style={{ marginBottom: 18 }}>{lang === 'fa' ? 'خلاصه سفارش' : 'Order summary'}</div>
            <div className="flex flex-col gap-3.5 overflow-y-auto" style={{ marginBottom: 18, maxHeight: 320 }}>
              {cart.map((item) => {
                const brand = BRANDS.find((b) => b.id === item.brandId);
                if (!brand) return null;
                return (
                  <div key={item.id} className="grid items-center gap-3" style={{ gridTemplateColumns: '60px 1fr auto' }}>
                    <div style={{ aspectRatio: '1.59/1' }}>
                      <GCard brand={brand} mini />
                    </div>
                    <div>
                      <div className="font-display text-[14px]">{brand.name[lang] || brand.name.en}</div>
                      <div className="font-mono text-ink-mute text-[11px]">{fmtPrice(item.amount)} × {fmtNumber(item.qty)}</div>
                    </div>
                    <div className="font-mono text-[13px]">{fmtPrice(item.amount * item.qty)}</div>
                  </div>
                );
              })}
            </div>
            <div className="divider" style={{ marginBottom: 16 }} />
            <div className="cart-total-row">
              <span>{t('subtotal')}</span>
              <span className="font-mono">{fmtPrice(subtotal)}</span>
            </div>
            <div className="cart-total-row">
              <span>{t('fee')}</span>
              <span className="font-mono">{fmtPrice(fee)}</span>
            </div>
            <div className="cart-total-row grand">
              <span>{t('total')}</span>
              <span className="font-mono">{fmtPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr !important; gap: 30px !important; } }
      `}</style>
    </main>
  );
}
