// ============================================
// T-Card — Checkout flow + Confirmation
// ============================================

function PageCheckout() {
  const { lang, navigate, cart, clearCart } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    cardNum: '', cardExp: '', cardCvc: '', cardName: '',
    pay: 'card'
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const fee = subtotal * 0.02;
  const total = subtotal + fee;

  if (cart.length === 0) {
    return (
      <main className="page container" style={{ paddingBlock: 'clamp(60px, 10vw, 140px)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)', marginBottom: 12 }}>{t('cart_empty')}</div>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 30 }}>{t('cart_empty_d')}</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>{t('shop_now')}</button>
      </main>
    );
  }

  const validate = () => {
    const e = {};
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

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const place = () => {
    setPlacing(true);
    setTimeout(() => {
      const orderId = 'TC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      // store order
      const orders = JSON.parse(localStorage.getItem('tcard.orders') || '[]');
      orders.unshift({
        id: orderId, total, fee, subtotal,
        items: cart.slice(), customer: { ...form, cardNum: undefined, cardCvc: undefined },
        placedAt: Date.now()
      });
      localStorage.setItem('tcard.orders', JSON.stringify(orders));
      clearCart();
      navigate('/confirmation/' + orderId);
    }, 1400);
  };

  const formatCard = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExp = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  return (
    <main className="page container" style={{ paddingBlock: 'clamp(30px, 4vw, 60px)' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop')} style={{ marginBottom: 24 }}>
        <Icon.ArrowLeft /> {t('back')}
      </button>
      <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginBottom: 8 }}>{t('checkout')}</h1>

      {/* Steps */}
      <div className="checkout-steps">
        {[1,2,3].map(n => (
          <div key={n} className={`cstep ${step === n ? 'active' : ''} ${step > n ? 'done' : ''}`}>
            <div className="bar"></div>
            <div className="label">
              <span>{lang === 'fa' ? ['۰۱','۰۲','۰۳'][n-1] : `0${n}`}</span>
              <span>{n === 1 ? t('step_details') : n === 2 ? t('step_payment') : t('step_review')}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 60 }} className="checkout-grid">
        {/* Form column */}
        <div>
          {step === 1 && (
            <Reveal>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 24 }}>{t('step_details')}</h2>
              <div className="form-grid">
                <div className="field" style={{ gridColumn: '1/-1' }}><label>{t('f_name')}</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={lang === 'fa' ? 'نام کامل' : 'Full name'} />
                  {errors.name && <span className="err">{errors.name}</span>}
                </div>
                <div className="field"><label>{t('f_email')}</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" />
                  {errors.email && <span className="err">{errors.email}</span>}
                </div>
                <div className="field"><label>{t('f_phone')}</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 555 123 4567" />
                  {errors.phone && <span className="err">{errors.phone}</span>}
                </div>
              </div>
            </Reveal>
          )}

          {step === 2 && (
            <Reveal>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 24 }}>{t('step_payment')}</h2>
              <div className="pay-methods" style={{ marginBottom: 28 }}>
                {[
                  { id: 'card', name: t('pay_card'), desc: t('pay_card_d'),
                    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20M6 16h3"/></svg> },
                  { id: 'wallet', name: t('pay_wallet'), desc: t('pay_wallet_d'),
                    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 8H6a3 3 0 0 1 0-6h12v6m3 0v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5m17 7h-3a2 2 0 0 0 0 4h3"/></svg> },
                  { id: 'crypto', name: t('pay_crypto'), desc: t('pay_crypto_d'),
                    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M9 8h4.5a2 2 0 0 1 0 4H9m0 0h5a2 2 0 0 1 0 4H9V8z"/></svg> }
                ].map(m => (
                  <button key={m.id} className={`pay-method ${form.pay === m.id ? 'active' : ''}`} onClick={() => setForm({...form, pay: m.id})}>
                    <div className="pay-method-head">{m.icon}<span className="pay-method-name">{m.name}</span></div>
                    <span className="pay-method-desc">{m.desc}</span>
                  </button>
                ))}
              </div>

              {form.pay === 'card' && (
                <div className="form-grid">
                  <div className="field" style={{ gridColumn: '1/-1' }}><label>{t('f_card_num')}</label>
                    <input value={form.cardNum} onChange={e => setForm({...form, cardNum: formatCard(e.target.value)})} placeholder="4242 4242 4242 4242" inputMode="numeric" />
                    {errors.cardNum && <span className="err">{errors.cardNum}</span>}
                  </div>
                  <div className="field" style={{ gridColumn: '1/-1' }}><label>{lang === 'fa' ? 'نام روی کارت' : 'Name on card'}</label>
                    <input value={form.cardName} onChange={e => setForm({...form, cardName: e.target.value})} placeholder={form.name || (lang === 'fa' ? 'نام کامل' : 'Full name')} />
                    {errors.cardName && <span className="err">{errors.cardName}</span>}
                  </div>
                  <div className="field"><label>{t('f_exp')}</label>
                    <input value={form.cardExp} onChange={e => setForm({...form, cardExp: formatExp(e.target.value)})} placeholder="12/27" inputMode="numeric" />
                    {errors.cardExp && <span className="err">{errors.cardExp}</span>}
                  </div>
                  <div className="field"><label>{t('f_cvc')}</label>
                    <input value={form.cardCvc} onChange={e => setForm({...form, cardCvc: e.target.value.replace(/\D/g,'').slice(0,4)})} placeholder="123" inputMode="numeric" />
                    {errors.cardCvc && <span className="err">{errors.cardCvc}</span>}
                  </div>
                </div>
              )}

              {form.pay === 'wallet' && (
                <div style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 'var(--radius)', textAlign: 'center', border: '1px solid var(--line)' }}>
                  <p style={{ color: 'var(--ink-soft)' }}>{lang === 'fa' ? 'پس از تایید سفارش، به درگاه کیف پول هدایت می‌شوید.' : 'You\'ll be redirected to your wallet provider after placing the order.'}</p>
                </div>
              )}

              {form.pay === 'crypto' && (
                <div style={{ padding: 32, background: 'var(--bg-card)', borderRadius: 'var(--radius)', textAlign: 'center', border: '1px solid var(--line)' }}>
                  <p style={{ color: 'var(--ink-soft)' }}>{lang === 'fa' ? 'پس از تایید سفارش، آدرس کیف پول و کد QR نمایش داده می‌شود.' : 'A QR code and wallet address will appear after placing the order.'}</p>
                </div>
              )}

              <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: 'var(--ink-mute)', fontSize: 12, marginTop: 24, fontFamily: 'var(--font-mono)' }}>
                <Icon.Shield /> {lang === 'fa' ? '256-bit رمزنگاری · PCI-DSS' : '256-bit encrypted · PCI-DSS L1'}
              </div>
            </Reveal>
          )}

          {step === 3 && (
            <Reveal>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 24 }}>{t('step_review')}</h2>
              <div style={{ padding: 24, border: '1px solid var(--line)', borderRadius: 'var(--radius)', marginBottom: 20, background: 'var(--bg-card)' }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{t('step_details')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
                  <div><span style={{ color: 'var(--ink-mute)' }}>{t('f_name')}: </span>{form.name}</div>
                  <div><span style={{ color: 'var(--ink-mute)' }}>{t('f_email')}: </span>{form.email}</div>
                  <div><span style={{ color: 'var(--ink-mute)' }}>{t('f_phone')}: </span>{form.phone}</div>
                </div>
              </div>
              <div style={{ padding: 24, border: '1px solid var(--line)', borderRadius: 'var(--radius)', marginBottom: 20, background: 'var(--bg-card)' }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{t('step_payment')}</div>
                <div style={{ fontSize: 14 }}>
                  {form.pay === 'card' && <span>{t('pay_card')} •••• {form.cardNum.slice(-4)}</span>}
                  {form.pay === 'wallet' && <span>{t('pay_wallet')}</span>}
                  {form.pay === 'crypto' && <span>{t('pay_crypto')}</span>}
                </div>
              </div>
              <div style={{ padding: 24, border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'var(--bg-card)' }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{t('cart')}</div>
                {cart.map(item => {
                  const brand = TCARD_DATA.BRANDS.find(b => b.id === item.brandId);
                  return (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                      <span>{brand.name[lang] || brand.name.en} × {TCARD_DATA.fmtNumber(item.qty, lang)}</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(item.amount * item.qty, lang)}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, gap: 12 }}>
            {step > 1 ? <button className="btn btn-ghost" onClick={back}><Icon.ArrowLeft /> {t('back')}</button> : <span />}
            {step < 3 ? (
              <button className="btn btn-primary btn-lg" onClick={next}>{t('continue')} <Icon.Arrow /></button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={place} disabled={placing}>
                {placing ? (lang === 'fa' ? 'در حال پردازش…' : 'Processing…') : (
                  <>{t('pay_now')} · {TCARD_DATA.fmtPrice(total, lang)}</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Summary column */}
        <aside>
          <div style={{ position: 'sticky', top: 100, padding: 28, border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
            <div className="eyebrow" style={{ marginBottom: 18 }}>{lang === 'fa' ? 'خلاصه سفارش' : 'Order summary'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18, maxHeight: 320, overflowY: 'auto' }}>
              {cart.map(item => {
                const brand = TCARD_DATA.BRANDS.find(b => b.id === item.brandId);
                return (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 12, alignItems: 'center' }}>
                    <div style={{ aspectRatio: '1.59/1' }}><GCard brand={brand} mini /></div>
                    <div>
                      <div style={{ fontSize: 14, fontFamily: 'var(--font-display)' }}>{brand.name[lang] || brand.name.en}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(item.amount, lang)} × {TCARD_DATA.fmtNumber(item.qty, lang)}</div>
                    </div>
                    <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(item.amount * item.qty, lang)}</div>
                  </div>
                );
              })}
            </div>
            <div className="divider" style={{ marginBottom: 16 }} />
            <div className="cart-total-row"><span>{t('subtotal')}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(subtotal, lang)}</span></div>
            <div className="cart-total-row"><span>{t('fee')}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(fee, lang)}</span></div>
            <div className="cart-total-row grand"><span>{t('total')}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(total, lang)}</span></div>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr !important; gap: 30px !important; } }
      `}</style>
    </main>
  );
}

function PageConfirmation({ orderId }) {
  const { lang, navigate } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const order = useMemo(() => {
    const orders = JSON.parse(localStorage.getItem('tcard.orders') || '[]');
    return orders.find(o => o.id === orderId);
  }, [orderId]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  if (!order) {
    return (
      <main className="page container" style={{ paddingBlock: 120, textAlign: 'center' }}>
        <p>{lang === 'fa' ? 'سفارش یافت نشد.' : 'Order not found.'}</p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>{t('back_home')}</button>
      </main>
    );
  }

  return (
    <main className="page container">
      <div className="confirm-stage">
        <div className="confirm-check"><Icon.Check /></div>
        <div className="eyebrow">{t('order_placed')}</div>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 16, maxWidth: '20ch', marginInline: 'auto' }}>
          {lang === 'fa' ? 'سفارش شما در راه است' : 'Your gifts are on their way'}
        </h1>
        <p style={{ marginTop: 18, color: 'var(--ink-soft)', maxWidth: '48ch', marginInline: 'auto', fontSize: 17 }}>{t('order_thanks')}</p>

        <div style={{ display: 'inline-flex', gap: 24, marginTop: 40, padding: '20px 32px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-pill)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{t('order_num')}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, marginTop: 2 }}>{order.id}</div>
          </div>
          <div style={{ width: 1, background: 'var(--line)' }} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{t('total')}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, marginTop: 2 }}>{TCARD_DATA.fmtPrice(order.total, lang)}</div>
          </div>
        </div>

        <div style={{ marginTop: 50, display: 'grid', gap: 16, maxWidth: 600, marginInline: 'auto' }}>
          {order.items.map(item => {
            const brand = TCARD_DATA.BRANDS.find(b => b.id === item.brandId);
            return (
              <Reveal key={item.id}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, alignItems: 'center', padding: 20, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
                  <GCard brand={brand} amount={item.amount} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{brand.name[lang] || brand.name.en}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>{TCARD_DATA.fmtPrice(item.amount, lang)} × {TCARD_DATA.fmtNumber(item.qty, lang)}</div>
                    {item.recipient && <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>→ {item.recipient}</div>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 50, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/account')}>{lang === 'fa' ? 'مشاهده سفارش‌ها' : 'View orders'}</button>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>{lang === 'fa' ? 'ادامه خرید' : 'Continue shopping'}</button>
        </div>
      </div>
    </main>
  );
}

window.PageCheckout = PageCheckout;
window.PageConfirmation = PageConfirmation;
