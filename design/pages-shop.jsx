// ============================================
// T-Card — Shop catalog + Product detail
// ============================================

function PageShop() {
  const { lang, navigate, query } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const initialCat = query.cat || 'all';
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState('pop');
  const [q, setQ] = useState('');

  useEffect(() => { setCat(query.cat || 'all'); }, [query.cat]);

  const filtered = useMemo(() => {
    let list = TCARD_DATA.BRANDS.slice();
    if (cat !== 'all') list = list.filter(b => b.cat === cat);
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(b =>
        b.name.en.toLowerCase().includes(qq) || b.name.fa.includes(q)
      );
    }
    if (sort === 'price-asc') list.sort((a,b) => a.amounts[0] - b.amounts[0]);
    else if (sort === 'price-desc') list.sort((a,b) => b.amounts[0] - a.amounts[0]);
    else if (sort === 'rating') list.sort((a,b) => b.rating - a.rating);
    else list.sort((a,b) => b.reviews - a.reviews);
    return list;
  }, [cat, sort, q]);

  return (
    <main className="page">
      <section className="container" style={{ paddingBlock: 'clamp(40px, 6vw, 80px) 40px' }}>
        <div className="eyebrow">{t('nav_shop')}</div>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 14, maxWidth: '18ch' }}>{t('shop_h')}</h1>
        <p className="muted" style={{ marginTop: 16, maxWidth: '50ch', fontSize: 18 }}>{t('shop_d')}</p>
      </section>

      <section className="container" style={{ paddingBottom: 32 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid var(--line-strong)', borderRadius: 'var(--radius-pill)',
            padding: '10px 18px', background: 'var(--bg-card)',
            flex: '1 1 280px', maxWidth: 380
          }}>
            <Icon.Search />
            <input
              placeholder={t('search_ph')} value={q} onChange={e => setQ(e.target.value)}
              style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 14 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginInlineStart: 'auto' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{t('sort_by')}</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding: '10px 14px', border: '1px solid var(--line-strong)', borderRadius: 'var(--radius-pill)', background: 'var(--bg-card)', fontSize: 13, outline: 'none' }}>
              <option value="pop">{t('sort_pop')}</option>
              <option value="price-asc">{t('sort_price_a')}</option>
              <option value="price-desc">{t('sort_price_d')}</option>
              <option value="rating">{t('sort_rating')}</option>
            </select>
          </div>
        </div>

        <div className="cat-strip" style={{ marginBottom: 48 }}>
          {TCARD_DATA.CATEGORIES.map(c => (
            <button key={c.id} className={`cat-chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
              {c[lang]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 100, color: 'var(--ink-mute)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>{t('no_results')}</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {filtered.map((b, i) => (
              <Reveal key={b.id} delay={Math.min(i * 50, 300)}>
                <ProductTile brand={b} onClick={() => navigate('/product/' + b.id)} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ===== Product detail page =====
function PageProduct({ brandId }) {
  const { lang, navigate, addToCart, showToast } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const brand = TCARD_DATA.BRANDS.find(b => b.id === brandId);
  const [amount, setAmount] = useState(brand ? brand.amounts[1] || brand.amounts[0] : 50);
  const [customAmount, setCustomAmount] = useState('');
  const [qty, setQty] = useState(1);
  const [recipient, setRecipient] = useState('self');
  const [delivery, setDelivery] = useState('now');
  const [recName, setRecName] = useState('');
  const [recEmail, setRecEmail] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [tab, setTab] = useState('about');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [brandId]);

  if (!brand) {
    return (
      <main className="page container" style={{ paddingBlock: 100, textAlign: 'center' }}>
        <h1 className="display" style={{ fontSize: 48 }}>{lang === 'fa' ? 'یافت نشد' : 'Not found'}</h1>
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
      brandId: brand.id, amount: finalAmount, qty,
      recipient: recipient === 'other' ? recName : null,
      recipientEmail: recipient === 'other' ? recEmail : null,
      message, deliveryDate: delivery === 'later' ? deliveryDate : null
    });
    showToast(lang === 'fa' ? 'به سبد افزوده شد' : 'Added to cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/checkout'), 300);
  };

  // Related: other brands in same category
  const related = TCARD_DATA.BRANDS.filter(b => b.cat === brand.cat && b.id !== brand.id).slice(0, 4);
  const fallback = TCARD_DATA.BRANDS.filter(b => b.id !== brand.id).slice(0, 4);
  const relatedList = related.length >= 2 ? related : fallback;

  return (
    <main className="page">
      <section className="container" style={{ paddingBlock: 'clamp(30px, 4vw, 60px)' }}>
        <div style={{ fontSize: 13, color: 'var(--ink-mute)', marginBottom: 32, fontFamily: 'var(--font-mono)' }}>
          <a href="#/" style={{ color: 'var(--ink-mute)' }}>{lang === 'fa' ? 'خانه' : 'Home'}</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <a href="#/shop" style={{ color: 'var(--ink-mute)' }}>{t('nav_shop')}</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)' }}>{brand.name[lang] || brand.name.en}</span>
        </div>

        <div className="product-detail">
          <div className="product-visual">
            <div className="product-card-stage">
              <GCard brand={brand} amount={finalAmount} />
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8, fontSize: 12, color: 'var(--ink-mute)' }}>
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon.Bolt /> {lang === 'fa' ? 'تحویل فوری' : 'Instant delivery'}</span>
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon.Shield /> {lang === 'fa' ? 'بدون انقضا' : 'No expiry'}</span>
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Icon.Gift /> {lang === 'fa' ? 'یادداشت رایگان' : 'Free note'}</span>
            </div>
          </div>

          <div className="product-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span className="eyebrow">{TCARD_DATA.CATEGORIES.find(c => c.id === brand.cat)?.[lang]}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--ink-soft)' }}>
                <Icon.Star style={{ color: 'var(--gold)' }} /> {brand.rating}
                <span style={{ color: 'var(--ink-mute)' }}>({TCARD_DATA.fmtNumber(brand.reviews, lang)})</span>
              </span>
            </div>
            <h1>{brand.name[lang] || brand.name.en}</h1>
            <p className="product-tagline">{brand.tagline[lang] || brand.tagline.en}</p>

            <div style={{ marginTop: 40 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>{t('pdp_amount')}</div>
              <div className="amounts">
                {brand.amounts.map(a => (
                  <button key={a} className={`amount-pill ${!customAmount && amount === a ? 'active' : ''}`} onClick={() => { setAmount(a); setCustomAmount(''); }}>
                    {TCARD_DATA.fmtPrice(a, lang)}
                  </button>
                ))}
                <input
                  type="number" placeholder={t('pdp_custom')}
                  value={customAmount} onChange={e => setCustomAmount(e.target.value)}
                  style={{
                    padding: '14px 8px', borderRadius: 'var(--radius)',
                    border: '1px solid var(--line-strong)', background: 'var(--bg-card)',
                    fontFamily: 'var(--font-mono)', fontSize: 14, textAlign: 'center', outline: 'none', minWidth: 0
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>{t('pdp_qty')}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, border: '1px solid var(--line-strong)', borderRadius: 'var(--radius-pill)', padding: 4 }}>
                <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span style={{ minWidth: 36, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtNumber(qty, lang)}</span>
                <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>{t('pdp_for')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className={`amount-pill ${recipient === 'self' ? 'active' : ''}`} onClick={() => setRecipient('self')}>{t('pdp_self')}</button>
                <button className={`amount-pill ${recipient === 'other' ? 'active' : ''}`} onClick={() => setRecipient('other')}>{t('pdp_someone')}</button>
              </div>
              {recipient === 'other' && (
                <div className="form-grid" style={{ marginTop: 16 }}>
                  <div className="field"><label>{t('f_rec_name')}</label>
                    <input value={recName} onChange={e => setRecName(e.target.value)} placeholder={lang === 'fa' ? 'مثلاً سارا' : 'e.g. Sara'} />
                  </div>
                  <div className="field"><label>{t('f_rec_email')}</label>
                    <input value={recEmail} onChange={e => setRecEmail(e.target.value)} placeholder="sara@email.com" />
                  </div>
                </div>
              )}
              <div className="field" style={{ marginTop: 16 }}>
                <label>{t('f_message')}</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder={lang === 'fa' ? 'یک یادداشت بنویس…' : 'Write a note…'} />
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>{t('pdp_delivery')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className={`amount-pill ${delivery === 'now' ? 'active' : ''}`} onClick={() => setDelivery('now')}>{t('pdp_now')}</button>
                <button className={`amount-pill ${delivery === 'later' ? 'active' : ''}`} onClick={() => setDelivery('later')}>{t('pdp_later')}</button>
              </div>
              {delivery === 'later' && (
                <div className="field" style={{ marginTop: 16 }}>
                  <label>{t('f_date')}</label>
                  <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                </div>
              )}
            </div>

            <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" style={{ flex: '1 1 200px' }} onClick={handleBuyNow}>
                {t('pdp_buy_now')} · {TCARD_DATA.fmtPrice(finalAmount * qty, lang)}
              </button>
              <button className="btn btn-ghost btn-lg" style={{ flex: '1 1 160px' }} onClick={handleAddToCart}>{t('pdp_to_cart')}</button>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button className={`tab ${tab === 'about' ? 'active' : ''}`} onClick={() => setTab('about')}>{t('pdp_about')}</button>
              <button className={`tab ${tab === 'redeem' ? 'active' : ''}`} onClick={() => setTab('redeem')}>{t('pdp_redeem')}</button>
              <button className={`tab ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>{t('pdp_reviews')}</button>
            </div>

            <div style={{ paddingBlock: 24, color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: 15 }}>
              {tab === 'about' && <p>{brand.description[lang] || brand.description.en}</p>}
              {tab === 'redeem' && (
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', marginBottom: 12 }}>{t('pdp_terms_t')}</p>
                  <p>{t('pdp_terms')}</p>
                </div>
              )}
              {tab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {TCARD_DATA.TESTIMONIALS.map((tt, i) => (
                    <div key={i} style={{ paddingBlock: 12, borderBottom: '1px solid var(--line)' }}>
                      <div style={{ display: 'flex', gap: 4, color: 'var(--gold)', marginBottom: 6 }}>
                        {Array.from({length: 5}).map((_, j) => <Icon.Star key={j} />)}
                      </div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', textWrap: 'pretty' }}>"{tt.quote[lang]}"</p>
                      <p style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>— {tt.name[lang]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section container">
        <div className="section-head">
          <h2 style={{ fontSize: 'var(--fs-h2)' }}>{lang === 'fa' ? 'شاید بپسندید' : 'You may also like'}</h2>
        </div>
        <div className="grid grid-4">
          {relatedList.map(b => (
            <ProductTile key={b.id} brand={b} onClick={() => navigate('/product/' + b.id)} />
          ))}
        </div>
      </section>
    </main>
  );
}

window.PageShop = PageShop;
window.PageProduct = PageProduct;
