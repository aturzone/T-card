// ============================================
// T-Card — Home page
// ============================================

function PageHome() {
  const { lang, navigate } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const featured = TCARD_DATA.BRANDS.slice(0, 4);

  return (
    <main className="page">
      {/* HERO */}
      <section className="hero container">
        <div className="bg-blob" style={{ width: 500, height: 500, background: 'var(--accent)', top: -100, right: -100, opacity: .12 }} />
        <div className="bg-blob" style={{ width: 350, height: 350, background: 'var(--gold)', bottom: -100, left: -50, opacity: .08 }} />
        <div className="hero-grid">
          <div>
            <div className="eyebrow">{t('hero_eyebrow')}</div>
            <h1 className="display hero-title" style={{ marginTop: 18 }}>
              {t('hero_title_a')}<br />
              <span className="italic" style={{ color: 'var(--accent)' }}>{t('hero_title_b')}</span>
            </h1>
            <p className="hero-sub">{t('hero_sub')}</p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
                {t('shop_now')} <Icon.Arrow />
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/how')}>{t('learn')}</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="num">{lang === 'fa' ? '۸۰+' : '80+'}</div>
                <div className="lbl">{t('stat_brands')}</div>
              </div>
              <div className="hero-stat">
                <div className="num">{lang === 'fa' ? '۹۰ ثانیه' : '90s'}</div>
                <div className="lbl">{t('stat_delivery')}</div>
              </div>
              <div className="hero-stat">
                <div className="num">4.9<span style={{ fontSize: 18, opacity: .5 }}>/5</span></div>
                <div className="lbl">{t('stat_rating')}</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card"><GCard brand={TCARD_DATA.BRANDS[1]} amount={100} /></div>
            <div className="hero-card"><GCard brand={TCARD_DATA.BRANDS[3]} amount={250} /></div>
            <div className="hero-card"><GCard brand={TCARD_DATA.BRANDS[5]} amount={150} /></div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section container">
        <div className="section-head">
          <div>
            <div className="eyebrow">{t('featured_eye')}</div>
            <h2 style={{ marginTop: 12 }}>{t('featured_h')}</h2>
            <p className="desc">{t('featured_d')}</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/shop')}>{t('view_all')} <Icon.Arrow /></button>
        </div>
        <div className="grid grid-4">
          {featured.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <ProductTile brand={b} onClick={() => navigate('/product/' + b.id)} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section container" style={{ paddingBlock: 'clamp(40px, 6vw, 80px)' }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <div className="eyebrow">{t('cats_eye')}</div>
            <h2 style={{ marginTop: 12 }}>{t('cats_h')}</h2>
          </div>
        </div>
        <div className="cat-strip">
          {TCARD_DATA.CATEGORIES.slice(1).map(c => (
            <a key={c.id} className="cat-chip" href={`#/shop?cat=${c.id}`}>{c[lang]}</a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section container" id="how">
        <div className="section-head">
          <div>
            <div className="eyebrow">{t('how_eye')}</div>
            <h2 style={{ marginTop: 12 }}>{t('how_h')}</h2>
          </div>
        </div>
        <div className="steps">
          {[1,2,3].map(n => (
            <Reveal key={n} delay={n * 100}>
              <div className="step">
                <div className="step-num">{lang === 'fa' ? ['۰۱','۰۲','۰۳'][n-1] : `0${n}`}</div>
                <div className="step-title">{t(`how_${n}_t`)}</div>
                <div className="step-desc">{t(`how_${n}_d`)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section container">
        <div className="section-head">
          <div>
            <div className="eyebrow">{t('testi_eye')}</div>
            <h2 style={{ marginTop: 12 }}>
              {lang === 'fa' ? 'مردم درباره ما چه می‌گویند' : 'What people are saying'}
            </h2>
          </div>
        </div>
        <div className="grid grid-3">
          {TCARD_DATA.TESTIMONIALS.map((tt, i) => (
            <Reveal key={i} delay={i * 80}>
              <figure style={{
                padding: 32, borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--line)',
                background: 'var(--bg-card)',
                height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                gap: 24, margin: 0
              }}>
                <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.4, margin: 0, textWrap: 'pretty' }}>
                  <span className="italic" style={{ color: 'var(--accent)' }}>“</span>{tt.quote[lang]}<span className="italic" style={{ color: 'var(--accent)' }}>”</span>
                </blockquote>
                <figcaption>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{tt.name[lang]}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>{tt.role[lang]}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section container">
        <Reveal>
          <div style={{
            padding: 'clamp(50px, 8vw, 100px) clamp(30px, 6vw, 80px)',
            background: 'var(--ink)', color: 'var(--bg)',
            borderRadius: 'var(--radius-lg)',
            display: 'grid', gridTemplateColumns: '1.4fr 1fr',
            gap: 40, alignItems: 'center',
            position: 'relative', overflow: 'hidden'
          }} className="cta-card">
            <div>
              <h2 className="display" style={{ fontSize: 'var(--fs-h1)', maxWidth: '14ch', lineHeight: 1.05 }}>
                {t('cta_h')}
              </h2>
              <p style={{ opacity: .7, marginTop: 18, maxWidth: '42ch', fontSize: 16 }}>{t('cta_sub')}</p>
              <button className="btn btn-lg" style={{ background: 'var(--bg)', color: 'var(--ink)', marginTop: 32 }} onClick={() => navigate('/shop')}>
                {t('cta_btn')} <Icon.Arrow />
              </button>
            </div>
            <div style={{ position: 'relative', height: 280 }}>
              <div style={{ position: 'absolute', top: 0, right: '5%', width: '78%', transform: 'rotate(-6deg)' }}>
                <GCard brand={TCARD_DATA.BRANDS[6]} amount={50} />
              </div>
              <div style={{ position: 'absolute', top: 60, right: '20%', width: '78%', transform: 'rotate(8deg)' }}>
                <GCard brand={TCARD_DATA.BRANDS[8]} amount={100} />
              </div>
            </div>
          </div>
          <style>{`
            @media (max-width: 800px) { .cta-card { grid-template-columns: 1fr !important; } }
          `}</style>
        </Reveal>
      </section>
    </main>
  );
}

window.PageHome = PageHome;
