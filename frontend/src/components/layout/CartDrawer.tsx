import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { GCard } from '@/components/product/GCard';
import { BRANDS } from '@/data/brands';

export function CartDrawer() {
  const {
    lang, t, fmtPrice, fmtNumber,
    cart, cartOpen, closeCart, removeFromCart, updateQty,
  } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const fee = subtotal > 0 ? Math.max(1, Math.round(subtotal * 0.02)) : 0;
  const total = subtotal + fee;

  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? 'open' : ''}`} onClick={closeCart} />
      <aside className={`drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="flex justify-between items-center p-6 border-b border-line">
          <h3 className="font-display text-[28px]">{t('cart')}</h3>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
            <Icon.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="font-display text-[28px] mb-2">{t('cart_empty')}</div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{t('cart_empty_d')}</div>
              <button
                className="btn btn-primary"
                style={{ marginTop: 28 }}
                onClick={() => { closeCart(); navigate('/shop'); }}
              >
                {t('shop_now')}
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const brand = BRANDS.find((b) => b.id === item.brandId);
              if (!brand) return null;
              return (
                <div className="cart-item" key={item.id}>
                  <div className="mini-card">
                    <GCard brand={brand} mini />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="cart-item-name">{brand.name[lang] || brand.name.en}</div>
                    <div className="cart-item-meta">
                      {fmtPrice(item.amount)} {item.recipient ? `· ${item.recipient}` : ''}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span className="font-mono text-[13px] w-6 text-center">{fmtNumber(item.qty)}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="cart-item-price">{fmtPrice(item.amount * item.qty)}</div>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                      {lang === 'fa' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-line bg-bg-soft">
            <div className="cart-total-row">
              <span>{t('subtotal')}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{fmtPrice(subtotal)}</span>
            </div>
            <div className="cart-total-row">
              <span>{t('fee')}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{fmtPrice(fee)}</span>
            </div>
            <div className="cart-total-row grand">
              <span>{t('total')}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{fmtPrice(total)}</span>
            </div>
            <button
              className="btn btn-primary btn-block btn-lg font-mono uppercase"
              style={{ letterSpacing: '0.08em', borderRadius: 0 }}
              onClick={() => { closeCart(); navigate('/checkout'); }}
            >
              {lang === 'fa' ? <>{t('checkout')} <Icon.Arrow /></> : <>CHECKOUT <Icon.Arrow /></>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
