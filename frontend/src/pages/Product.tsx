import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { GCard } from '@/components/product/GCard';
import { ProductTile } from '@/components/product/ProductTile';
import { BRANDS } from '@/data/brands';
import { CATEGORIES } from '@/data/categories';
import { TESTIMONIALS } from '@/data/testimonials';

export function Product() {
  const { id: brandId } = useParams<{ id: string }>();
  const { lang, t, fmtPrice, fmtNumber, addToCart, showToast } = useApp();
  const navigate = useNavigate();

  const brand = BRANDS.find((b) => b.id === brandId);

  const [amount, setAmount] = useState<number>(brand ? brand.amounts[1] || brand.amounts[0] : 50);
  const [customAmount, setCustomAmount] = useState('');
  const [qty, setQty] = useState(1);
  const [recipient, setRecipient] = useState<'self' | 'other'>('self');
  const [delivery, setDelivery] = useState<'now' | 'later'>('now');
  const [recName, setRecName] = useState('');
  const [recEmail, setRecEmail] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [tab, setTab] = useState<'about' | 'redeem' | 'reviews'>('about');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [brandId]);

  if (!brand) {
    return (
      <main className="page container-x text-center" style={{ paddingBlock: 100 }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 700 }}>
          {lang === 'fa' ? 'یافت نشد' : 'NOT FOUND'}
        </h1>
        <button className="btn btn-primary" style={{ marginTop: 30 }} onClick={() => navigate('/shop')}>
          {t('back')}
        </button>
      </main>
    );
  }

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const handleAddToCart = () => {
    if (!finalAmount || finalAmount <= 0) return;
    addToCart({
      brandId: brand.id,
      amount: finalAmount,
      qty,
      recipient: recipient === 'other' ? recName : null,
      recipientEmail: recipient === 'other' ? recEmail : null,
      message,
      deliveryDate: delivery === 'later' ? deliveryDate : null,
    });
    showToast(lang === 'fa' ? 'به سبد افزوده شد' : 'Added to cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/checkout'), 300);
  };

  const related = BRANDS.filter((b) => b.cat === brand.cat && b.id !== brand.id).slice(0, 4);
  const fallback = BRANDS.filter((b) => b.id !== brand.id).slice(0, 4);
  const relatedList = related.length >= 2 ? related : fallback;

  const catName = CATEGORIES.find((c) => c.id === brand.cat);
  // TODO(i18n): page-name lockup uses the brand display name directly.
  const brandLabel = brand.name[lang] || brand.name.en;
  const brandIndex = BRANDS.findIndex((b) => b.id === brand.id) + 1;

  return (
    <main className="page">
      <section className="container-x" style={{ paddingBlock: 'clamp(30px, 4vw, 60px)' }}>
        <div
          className="font-mono uppercase text-ink-mute"
          style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 24 }}
        >
          <Link to="/" className="text-ink-mute">{lang === 'fa' ? 'خانه' : 'HOME'}</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link to="/shop" className="text-ink-mute">{t('nav_shop').toUpperCase()}</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)' }}>
            {String(brandIndex).padStart(2, '0')} &mdash; {(catName ? catName[lang] : brand.cat).toUpperCase()}
          </span>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: 'var(--fs-hero)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--ink)',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          {brandLabel}
        </h1>
        <p
          className="product-tagline"
          style={{
            color: 'var(--ink-soft)',
            fontSize: 18,
            marginTop: 24,
            maxWidth: '50ch',
          }}
        >
          {brand.tagline[lang] || brand.tagline.en}
        </p>
      </section>

      <section className="container-x" style={{ paddingBlock: 'clamp(20px, 3vw, 40px)' }}>
        <div className="grid items-start gap-10 lg:gap-[80px] lg:[grid-template-columns:1.2fr_1fr] border-t border-line" style={{ paddingTop: 40 }}>
          <div className="flex flex-col gap-5 lg:sticky lg:top-[100px]">
            <div className="product-card-stage">
              <GCard brand={brand} amount={finalAmount} />
            </div>
            <div className="flex gap-4 justify-center mt-2 font-mono uppercase text-[11px] text-ink-mute" style={{ letterSpacing: '0.08em' }}>
              <span className="inline-flex items-center gap-1.5"><Icon.Bolt /> {lang === 'fa' ? 'تحویل فوری' : 'INSTANT'}</span>
              <span className="inline-flex items-center gap-1.5"><Icon.Shield /> {lang === 'fa' ? 'بدون انقضا' : 'NO EXPIRY'}</span>
              <span className="inline-flex items-center gap-1.5"><Icon.Gift /> {lang === 'fa' ? 'یادداشت رایگان' : 'FREE NOTE'}</span>
            </div>
          </div>

          <div className="product-info">
            <div className="flex items-center gap-4 mb-3">
              <span className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '0.08em' }}>
                {catName ? catName[lang] : brand.cat}
              </span>
              <span className="font-mono inline-flex items-center gap-1 text-[12px] text-ink-soft">
                <Icon.Star style={{ color: 'var(--ink)' }} /> {brand.rating}
                <span className="text-ink-mute">({fmtNumber(brand.reviews)})</span>
              </span>
            </div>

            <div style={{ marginTop: 32 }}>
              <div
                className="font-mono uppercase text-ink-mute"
                style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 14 }}
              >
                {t('pdp_amount')}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {brand.amounts.map((a) => (
                  <button
                    key={a}
                    className={`amount-pill ${!customAmount && amount === a ? 'active' : ''}`}
                    onClick={() => { setAmount(a); setCustomAmount(''); }}
                  >
                    {fmtPrice(a)}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder={t('pdp_custom')}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="font-mono text-center outline-none border-0 border-b border-line bg-transparent text-[14px] focus:border-ink"
                  style={{ padding: '14px 8px', minWidth: 0 }}
                />
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div
                className="font-mono uppercase text-ink-mute"
                style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 14 }}
              >
                {t('pdp_qty')}
              </div>
              <div className="inline-flex items-center border border-line" style={{ padding: 4 }}>
                <button
                  className="icon-btn font-mono"
                  style={{ width: 32, height: 32 }}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  −
                </button>
                <span className="font-mono text-center" style={{ minWidth: 36 }}>{fmtNumber(qty)}</span>
                <button
                  className="icon-btn font-mono"
                  style={{ width: 32, height: 32 }}
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div
                className="font-mono uppercase text-ink-mute"
                style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 14 }}
              >
                {t('pdp_for')}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button className={`amount-pill ${recipient === 'self' ? 'active' : ''}`} onClick={() => setRecipient('self')}>{t('pdp_self')}</button>
                <button className={`amount-pill ${recipient === 'other' ? 'active' : ''}`} onClick={() => setRecipient('other')}>{t('pdp_someone')}</button>
              </div>
              {recipient === 'other' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 16 }}>
                  <div className="field">
                    <label>{t('f_rec_name')}</label>
                    <input value={recName} onChange={(e) => setRecName(e.target.value)} placeholder={lang === 'fa' ? 'مثلاً سارا' : 'e.g. Sara'} />
                  </div>
                  <div className="field">
                    <label>{t('f_rec_email')}</label>
                    <input value={recEmail} onChange={(e) => setRecEmail(e.target.value)} placeholder="sara@email.com" />
                  </div>
                </div>
              )}
              <div className="field" style={{ marginTop: 16 }}>
                <label>{t('f_message')}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder={lang === 'fa' ? 'یک یادداشت بنویس…' : 'Write a note…'}
                />
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div
                className="font-mono uppercase text-ink-mute"
                style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 14 }}
              >
                {t('pdp_delivery')}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button className={`amount-pill ${delivery === 'now' ? 'active' : ''}`} onClick={() => setDelivery('now')}>{t('pdp_now')}</button>
                <button className={`amount-pill ${delivery === 'later' ? 'active' : ''}`} onClick={() => setDelivery('later')}>{t('pdp_later')}</button>
              </div>
              {delivery === 'later' && (
                <div className="field" style={{ marginTop: 16 }}>
                  <label>{t('f_date')}</label>
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap" style={{ marginTop: 40 }}>
              <button
                className="btn btn-primary btn-lg font-mono uppercase"
                style={{ flex: '1 1 200px', letterSpacing: '0.06em' }}
                onClick={handleBuyNow}
              >
                {t('pdp_buy_now')} · {fmtPrice(finalAmount * qty)}
              </button>
              <button
                className="btn btn-ghost btn-lg font-mono uppercase"
                style={{ flex: '1 1 160px', letterSpacing: '0.06em' }}
                onClick={handleAddToCart}
              >
                {t('pdp_to_cart')}
              </button>
            </div>

            <div className="flex border-b border-line" style={{ marginTop: 32 }}>
              <button className={`tab ${tab === 'about' ? 'active' : ''}`} onClick={() => setTab('about')}>{t('pdp_about')}</button>
              <button className={`tab ${tab === 'redeem' ? 'active' : ''}`} onClick={() => setTab('redeem')}>{t('pdp_redeem')}</button>
              <button className={`tab ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>{t('pdp_reviews')}</button>
            </div>

            <div className="text-ink-soft" style={{ paddingBlock: 24, lineHeight: 1.7, fontSize: 15 }}>
              {tab === 'about' && <p>{brand.description[lang] || brand.description.en}</p>}
              {tab === 'redeem' && (
                <div>
                  <p className="font-display text-ink" style={{ fontSize: 18, marginBottom: 12 }}>{t('pdp_terms_t')}</p>
                  <p>{t('pdp_terms')}</p>
                </div>
              )}
              {tab === 'reviews' && (
                <div className="flex flex-col gap-5">
                  {TESTIMONIALS.map((tt, i) => (
                    <div key={i} style={{ paddingBlock: 12, borderBottom: '1px solid var(--line)' }}>
                      <div className="flex gap-1 mb-1.5" style={{ color: 'var(--ink)' }}>
                        {Array.from({ length: 5 }).map((_, j) => <Icon.Star key={j} />)}
                      </div>
                      <p className="font-display text-ink" style={{ fontSize: 18, textWrap: 'pretty' as 'pretty' }}>"{tt.quote[lang]}"</p>
                      <p className="font-mono text-ink-mute text-[12px]" style={{ marginTop: 6 }}>— {tt.name[lang]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x section-padding">
        <div
          className="font-mono uppercase text-ink-mute"
          style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 20 }}
        >
          {lang === 'fa' ? 'مرتبط' : 'RELATED'}
        </div>
        <div className="flex justify-between items-end gap-6 flex-wrap border-b border-line" style={{ marginBottom: 32, paddingBottom: 20 }}>
          <h2
            className="font-display"
            style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}
          >
            {lang === 'fa' ? 'شاید بپسندید' : 'YOU MAY ALSO LIKE'}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-line">
          {relatedList.map((b) => (
            <div
              key={b.id}
              className="border-r border-b border-line"
              style={{ padding: 'clamp(12px, 2vw, 20px)' }}
            >
              <ProductTile brand={b} onClick={() => navigate('/product/' + b.id)} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
