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
      <main className="page container-x text-center" style={{ paddingBlock: 120 }}>
        <p>{lang === 'fa' ? 'سفارش یافت نشد.' : 'Order not found.'}</p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>{t('back_home')}</button>
      </main>
    );
  }

  return (
    <main className="page container-x">
      <div className="text-center" style={{ paddingBlock: 80 }}>
        <div className="confirm-check"><Icon.Check /></div>
        <div className="eyebrow">{t('order_placed')}</div>
        <h1 className="display mx-auto" style={{ fontSize: 'var(--fs-h1)', marginTop: 16, maxWidth: '20ch' }}>
          {lang === 'fa' ? 'سفارش شما در راه است' : 'Your gifts are on their way'}
        </h1>
        <p className="text-ink-soft mx-auto" style={{ marginTop: 18, maxWidth: '48ch', fontSize: 17 }}>{t('order_thanks')}</p>

        <div
          className="inline-flex gap-6 flex-wrap justify-center bg-bg-card border border-line rounded-pill"
          style={{ marginTop: 40, padding: '20px 32px' }}
        >
          <div>
            <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.1em' }}>{t('order_num')}</div>
            <div className="font-mono text-[16px]" style={{ marginTop: 2 }}>{order.id}</div>
          </div>
          <div style={{ width: 1, background: 'var(--line)' }} />
          <div>
            <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.1em' }}>{t('total')}</div>
            <div className="font-mono text-[16px]" style={{ marginTop: 2 }}>{fmtPrice(order.total)}</div>
          </div>
        </div>

        <div className="mx-auto grid gap-4" style={{ marginTop: 50, maxWidth: 600 }}>
          {order.items.map((item) => {
            const brand = BRANDS.find((b) => b.id === item.brandId);
            if (!brand) return null;
            return (
              <Reveal key={item.id}>
                <div
                  className="grid items-center gap-6 bg-bg-card border border-line"
                  style={{ gridTemplateColumns: '120px 1fr', padding: 20, borderRadius: 'var(--radius)' }}
                >
                  <GCard brand={brand} amount={item.amount} />
                  <div className="text-left">
                    <div className="font-display text-[22px]">{brand.name[lang] || brand.name.en}</div>
                    <div className="text-ink-soft text-[13px]" style={{ marginTop: 4 }}>
                      {fmtPrice(item.amount)} × {fmtNumber(item.qty)}
                    </div>
                    {item.recipient && (
                      <div className="font-mono text-ink-mute text-[12px]" style={{ marginTop: 6 }}>→ {item.recipient}</div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center flex-wrap" style={{ marginTop: 50 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/account')}>{lang === 'fa' ? 'مشاهده سفارش‌ها' : 'View orders'}</button>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>{lang === 'fa' ? 'ادامه خرید' : 'Continue shopping'}</button>
        </div>
      </div>
    </main>
  );
}
