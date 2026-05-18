import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { GCard } from '@/components/product/GCard';
import { BRANDS } from '@/data/brands';
import type { Order } from '@/data/types';

export function Confirmation() {
  const { id: orderId } = useParams<{ id: string }>();
  const { lang, t, fmtPrice, fmtNumber } = useApp();
  const navigate = useNavigate();

  const order = useMemo<Order | undefined>(() => {
    const orders: Order[] = JSON.parse(localStorage.getItem('tcard.orders') || '[]');
    return orders.find((o) => o.id === orderId);
  }, [orderId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!order) {
    return (
      <main className="page container-x" style={{ paddingBlock: 120 }}>
        <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
          {t('order_placed')}
        </div>
        <h1
          className="display"
          style={{
            fontSize: 'var(--fs-hero)',
            fontWeight: 700,
            letterSpacing: '-.04em',
            lineHeight: 0.95,
            color: 'var(--ink)',
            marginTop: 18,
          }}
        >
          {lang === 'fa' ? 'یافت نشد' : 'NOT FOUND'}
        </h1>
        <p className="text-ink-soft" style={{ marginTop: 20, fontSize: 18 }}>
          {lang === 'fa' ? 'سفارش یافت نشد.' : 'Order not found.'}
        </p>
        <button
          className="font-mono uppercase text-[12px] inline-flex items-center gap-2"
          style={{
            background: 'var(--ink)',
            color: 'var(--bg)',
            padding: '14px 22px',
            marginTop: 28,
            letterSpacing: '.08em',
            borderRadius: 0,
          }}
          onClick={() => navigate('/')}
        >
          {t('back_home')} →
        </button>
      </main>
    );
  }

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      {/* LOCKUP HERO */}
      <div className="confirm-check" style={{ marginBottom: 28 }}>
        <Icon.Check />
      </div>
      <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
        {t('order_placed')} — {order.id}
      </div>
      <h1
        className="display"
        style={{
          fontSize: 'var(--fs-hero)',
          fontWeight: 700,
          letterSpacing: '-.04em',
          lineHeight: 0.95,
          color: 'var(--ink)',
          marginTop: 18,
        }}
      >
        {lang === 'fa' ? 'متشکریم' : 'THANK YOU'}
      </h1>
      <p
        className="text-ink-soft"
        style={{ marginTop: 20, fontSize: 18, lineHeight: 1.55, maxWidth: '60ch' }}
      >
        {t('order_thanks')}
      </p>

      {/* ORDER META — hairline row */}
      <div
        className="grid border-t border-line"
        style={{ gridTemplateColumns: '1fr 1fr', marginTop: 40, padding: '20px 0' }}
      >
        <div>
          <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
            {t('order_num')}
          </div>
          <div className="font-mono text-[15px]" style={{ marginTop: 4 }}>{order.id}</div>
        </div>
        <div className="text-right">
          <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
            {t('total')}
          </div>
          <div className="font-mono text-[15px]" style={{ marginTop: 4 }}>{fmtPrice(order.total)}</div>
        </div>
      </div>

      {/* STATUS TIMELINE — hairline */}
      <div className="border-t border-line" style={{ marginTop: 40, paddingTop: 24 }}>
        <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em', marginBottom: 16 }}>
          {lang === 'fa' ? 'وضعیت' : 'Status'}
        </div>
        <ol className="flex flex-col" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            { en: 'Order placed', fa: 'سفارش ثبت شد', done: true },
            { en: 'Processing', fa: 'در حال پردازش', done: true },
            { en: 'Sent', fa: 'ارسال شده', done: false },
            { en: 'Delivered', fa: 'تحویل داده شده', done: false },
          ].map((s, i) => (
            <li
              key={i}
              className="grid items-center gap-4 border-b border-line"
              style={{ gridTemplateColumns: '60px 1fr auto', padding: '14px 0' }}
            >
              <span
                className="font-mono text-ink-mute text-[12px]"
                style={{ letterSpacing: '.08em' }}
              >
                {lang === 'fa' ? ['۰۱', '۰۲', '۰۳', '۰۴'][i] : `0${i + 1}`}
              </span>
              <span style={{ fontSize: 16, color: s.done ? 'var(--ink)' : 'var(--ink-mute)' }}>
                {s[lang]}
              </span>
              <span
                className="font-mono uppercase text-[11px]"
                style={{
                  letterSpacing: '.08em',
                  color: s.done ? 'var(--ink)' : 'var(--ink-mute)',
                }}
              >
                {s.done ? (lang === 'fa' ? 'تمام' : 'Done') : (lang === 'fa' ? 'در انتظار' : 'Pending')}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* ITEMS */}
      <div className="border-t border-line" style={{ marginTop: 40, paddingTop: 24 }}>
        <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em', marginBottom: 24 }}>
          {lang === 'fa' ? 'اقلام' : 'Items'}
        </div>
        <div className="flex flex-col">
          {order.items.map((item) => {
            const brand = BRANDS.find((b) => b.id === item.brandId);
            if (!brand) return null;
            return (
              <Reveal key={item.id}>
                <div
                  className="grid items-center gap-6 border-b border-line"
                  style={{ gridTemplateColumns: '120px 1fr', padding: '20px 0' }}
                >
                  <GCard brand={brand} amount={item.amount} />
                  <div>
                    <div
                      className="font-display"
                      style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}
                    >
                      {brand.name[lang] || brand.name.en}
                    </div>
                    <div
                      className="font-mono text-ink-mute text-[12px]"
                      style={{ marginTop: 6, letterSpacing: '.04em' }}
                    >
                      {fmtPrice(item.amount)} × {fmtNumber(item.qty)}
                    </div>
                    {item.recipient && (
                      <div
                        className="font-mono text-ink-mute text-[12px]"
                        style={{ marginTop: 4, letterSpacing: '.04em' }}
                      >
                        → {item.recipient}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap" style={{ marginTop: 40 }}>
        <button
          className="font-mono uppercase text-[12px] inline-flex items-center gap-2"
          style={{
            border: '1px solid var(--line-strong)',
            color: 'var(--ink)',
            padding: '14px 22px',
            letterSpacing: '.08em',
            borderRadius: 0,
            background: 'transparent',
          }}
          onClick={() => navigate('/account')}
        >
          {lang === 'fa' ? 'مشاهده سفارش‌ها' : 'View orders'}
        </button>
        <button
          className="font-mono uppercase text-[12px] inline-flex items-center gap-2"
          style={{
            background: 'var(--ink)',
            color: 'var(--bg)',
            padding: '14px 22px',
            letterSpacing: '.08em',
            borderRadius: 0,
          }}
          onClick={() => navigate('/shop')}
        >
          {lang === 'fa' ? 'ادامه خرید' : 'Continue shopping'} →
        </button>
      </div>
    </main>
  );
}
