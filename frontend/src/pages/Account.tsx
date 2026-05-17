import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { GCard } from '@/components/product/GCard';
import { BRANDS } from '@/data/brands';
import type { Order } from '@/data/types';

type Tab = 'orders' | 'saved' | 'profile' | 'settings';

export function Account() {
  const { lang, t, fmtPrice } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('orders');

  const orders = useMemo<Order[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tcard.orders') || '[]');
    } catch {
      return [];
    }
  }, [tab]);

  const tabs: Array<[Tab, string]> = [
    ['orders', t('acc_orders')],
    ['saved', t('acc_saved')],
    ['profile', t('acc_profile')],
    ['settings', t('acc_settings')],
  ];

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      {/* LOCKUP HERO */}
      <div style={{ marginBottom: 56 }}>
        <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
          {t('acc_welcome')} — 04 / 05
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
          {lang === 'fa' ? 'حساب' : 'ACCOUNT'}
        </h1>
        <p
          className="text-ink-soft"
          style={{ marginTop: 20, fontSize: 18, lineHeight: 1.5, maxWidth: '60ch' }}
        >
          {lang === 'fa' ? 'سلام، مهمان' : 'Hello, Guest'}
        </p>
      </div>

      <div style={{ maxWidth: '60ch' }}>
        {/* TABS — mono row, hairline divider */}
        <nav
          className="flex flex-wrap gap-6 border-t border-b border-line"
          style={{ padding: '16px 0' }}
        >
          {tabs.map(([id, lbl]) => (
            <button
              key={id}
              className="font-mono uppercase text-[12px]"
              style={{
                letterSpacing: '.08em',
                color: tab === id ? 'var(--ink)' : 'var(--ink-mute)',
                borderBottom: tab === id ? '1px solid var(--ink)' : '1px solid transparent',
                paddingBottom: 4,
              }}
              onClick={() => setTab(id)}
            >
              {lbl}
            </button>
          ))}
          <button
            className="font-mono uppercase text-[12px] ms-auto"
            style={{ letterSpacing: '.08em', color: 'var(--ink-mute)' }}
          >
            {t('acc_signout')}
          </button>
        </nav>

        <div style={{ marginTop: 40 }}>
          {tab === 'orders' && (
            orders.length === 0 ? (
              <div className="border-b border-line" style={{ padding: '40px 0' }}>
                <p
                  className="font-display"
                  style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: 16 }}
                >
                  {lang === 'fa' ? 'هنوز سفارشی ندارید' : 'No orders yet'}
                </p>
                <p className="text-ink-soft" style={{ marginBottom: 24, fontSize: 16 }}>
                  {lang === 'fa' ? 'برای شروع، یک کارت انتخاب کنید.' : 'Send your first card to get started.'}
                </p>
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
                  {t('shop_now')} →
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                {orders.map((o) => (
                  <div key={o.id} className="border-t border-line" style={{ padding: '24px 0' }}>
                    <div className="flex justify-between items-start flex-wrap gap-3" style={{ marginBottom: 18 }}>
                      <div>
                        <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
                          {t('order_num')}
                        </div>
                        <div className="font-mono text-[15px]" style={{ marginTop: 4 }}>{o.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
                          {new Date(o.placedAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                        </div>
                        <div
                          className="font-display"
                          style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em', marginTop: 4 }}
                        >
                          {fmtPrice(o.total)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2.5 overflow-x-auto">
                      {o.items.map((item) => {
                        const brand = BRANDS.find((b) => b.id === item.brandId);
                        if (!brand) return null;
                        return (
                          <div key={item.id} style={{ width: 130, flex: 'none' }}>
                            <GCard brand={brand} amount={item.amount} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="border-t border-line" />
              </div>
            )
          )}

          {tab === 'saved' && (
            <div className="border-b border-line" style={{ padding: '40px 0' }}>
              <p
                className="font-display text-ink-soft"
                style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-.02em' }}
              >
                {lang === 'fa' ? 'هنوز کارتی ذخیره نشده' : 'No saved cards yet'}
              </p>
            </div>
          )}

          {tab === 'profile' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-mono uppercase text-ink-mute text-[11px]"
                  style={{ letterSpacing: '.08em' }}
                >
                  {t('f_name')}
                </label>
                <input
                  className="border-0 border-b border-line focus:border-ink rounded-none bg-transparent"
                  style={{ padding: '10px 0', fontSize: 16, outline: 'none' }}
                  defaultValue="Guest"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-mono uppercase text-ink-mute text-[11px]"
                  style={{ letterSpacing: '.08em' }}
                >
                  {t('f_email')}
                </label>
                <input
                  className="border-0 border-b border-line focus:border-ink rounded-none bg-transparent"
                  style={{ padding: '10px 0', fontSize: 16, outline: 'none' }}
                  defaultValue="guest@t-card.co"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-mono uppercase text-ink-mute text-[11px]"
                  style={{ letterSpacing: '.08em' }}
                >
                  {t('f_phone')}
                </label>
                <input
                  className="border-0 border-b border-line focus:border-ink rounded-none bg-transparent"
                  style={{ padding: '10px 0', fontSize: 16, outline: 'none' }}
                  placeholder="+1 555 ..."
                />
              </div>
              <button
                className="font-mono uppercase text-[12px] self-start inline-flex items-center gap-2"
                style={{
                  background: 'var(--ink)',
                  color: 'var(--bg)',
                  padding: '14px 22px',
                  marginTop: 10,
                  letterSpacing: '.08em',
                  borderRadius: 0,
                }}
              >
                {lang === 'fa' ? 'ذخیره' : 'Save changes'} →
              </button>
            </div>
          )}

          {tab === 'settings' && (
            <div className="flex flex-col">
              <div className="border-t border-line" style={{ padding: '24px 0' }}>
                <div
                  className="font-mono uppercase text-ink-mute text-[11px]"
                  style={{ letterSpacing: '.08em', marginBottom: 12 }}
                >
                  {lang === 'fa' ? 'اعلان‌ها' : 'Notifications'}
                </div>
                <label className="flex justify-between items-center cursor-pointer">
                  <span style={{ fontSize: 16 }}>
                    {lang === 'fa' ? 'یادآور تولد دوستان' : 'Birthday reminders'}
                  </span>
                  <input type="checkbox" defaultChecked />
                </label>
              </div>
              <div className="border-t border-line" style={{ padding: '24px 0' }}>
                <div
                  className="font-mono uppercase text-ink-mute text-[11px]"
                  style={{ letterSpacing: '.08em', marginBottom: 12 }}
                >
                  {lang === 'fa' ? 'دو-عاملی' : '2-factor auth'}
                </div>
                <label className="flex justify-between items-center cursor-pointer">
                  <span style={{ fontSize: 16 }}>
                    {lang === 'fa' ? 'فعال' : 'Enable'}
                  </span>
                  <input type="checkbox" />
                </label>
              </div>
              <div className="border-t border-line" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
