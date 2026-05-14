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
      <div style={{ marginBottom: 60 }}>
        <div className="eyebrow">{t('acc_welcome')}</div>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 14 }}>
          {lang === 'fa' ? 'سلام، مهمان' : 'Hello, Guest'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:[grid-template-columns:240px_1fr] gap-7 md:gap-[60px]">
        <nav className="account-nav flex flex-col gap-1">
          {tabs.map(([id, lbl]) => (
            <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{lbl}</button>
          ))}
          <div className="divider" style={{ margin: '16px 0' }} />
          <button>{t('acc_signout')}</button>
        </nav>

        <div>
          {tab === 'orders' && (
            orders.length === 0 ? (
              <div className="text-center border border-line-strong border-dashed" style={{ padding: 60, borderRadius: 'var(--radius-lg)' }}>
                <p className="font-display" style={{ fontSize: 26, marginBottom: 12 }}>
                  {lang === 'fa' ? 'هنوز سفارشی ندارید' : 'No orders yet'}
                </p>
                <p className="text-ink-soft" style={{ marginBottom: 24 }}>
                  {lang === 'fa' ? 'برای شروع، یک کارت انتخاب کنید.' : 'Send your first card to get started.'}
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/shop')}>{t('shop_now')}</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((o) => (
                  <div key={o.id} className="border border-line bg-bg-card" style={{ padding: 24, borderRadius: 'var(--radius)' }}>
                    <div className="flex justify-between items-start flex-wrap gap-2.5" style={{ marginBottom: 18 }}>
                      <div>
                        <div className="font-mono text-ink-mute text-[12px]" style={{ letterSpacing: '.1em' }}>{t('order_num')}</div>
                        <div className="font-mono text-[16px]" style={{ marginTop: 2 }}>{o.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-ink-mute text-[12px]">
                          {new Date(o.placedAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                        </div>
                        <div className="font-display" style={{ fontSize: 22, marginTop: 2 }}>{fmtPrice(o.total)}</div>
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
              </div>
            )
          )}

          {tab === 'saved' && (
            <div className="text-center text-ink-soft border border-line-strong border-dashed" style={{ padding: 60, borderRadius: 'var(--radius-lg)' }}>
              <p className="font-display" style={{ fontSize: 24 }}>{lang === 'fa' ? 'هنوز کارتی ذخیره نشده' : 'No saved cards yet'}</p>
            </div>
          )}

          {tab === 'profile' && (
            <div className="flex flex-col gap-4" style={{ maxWidth: 500 }}>
              <div className="field"><label>{t('f_name')}</label><input defaultValue="Guest" /></div>
              <div className="field"><label>{t('f_email')}</label><input defaultValue="guest@t-card.co" /></div>
              <div className="field"><label>{t('f_phone')}</label><input defaultValue="" placeholder="+1 555 ..." /></div>
              <button className="btn btn-primary self-start" style={{ marginTop: 10 }}>{lang === 'fa' ? 'ذخیره' : 'Save changes'}</button>
            </div>
          )}

          {tab === 'settings' && (
            <div className="flex flex-col gap-6" style={{ maxWidth: 500 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{lang === 'fa' ? 'اعلان‌ها' : 'Notifications'}</div>
                <label className="flex justify-between border border-line cursor-pointer" style={{ padding: 16, borderRadius: 'var(--radius-sm)' }}>
                  <span>{lang === 'fa' ? 'یادآور تولد دوستان' : 'Birthday reminders'}</span>
                  <input type="checkbox" defaultChecked />
                </label>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{lang === 'fa' ? 'دو-عاملی' : '2-factor auth'}</div>
                <label className="flex justify-between border border-line cursor-pointer" style={{ padding: 16, borderRadius: 'var(--radius-sm)' }}>
                  <span>{lang === 'fa' ? 'فعال' : 'Enable'}</span>
                  <input type="checkbox" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
