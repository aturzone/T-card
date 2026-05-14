// ============================================
// T-Card — Misc pages: About, FAQ, Contact, How, Account, Legal
// ============================================

function PageAbout() {
  const { lang } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  return (
    <main className="page container" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="about-grid">
        <div>
          <div className="eyebrow">{lang === 'fa' ? 'درباره ما' : 'About'}</div>
          <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 16, lineHeight: 1.05 }}>{t('about_h')}</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.7, paddingTop: 12 }}>
          <p>{t('about_p1')}</p>
          <p>{t('about_p2')}</p>
        </div>
      </div>

      <div style={{ marginTop: 100, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }} className="vals">
        {[
          { n: lang === 'fa' ? '۰۱' : '01', t: lang === 'fa' ? 'سادگی' : 'Simplicity', d: lang === 'fa' ? 'گیفت‌کارت در سه قدم. بدون پر کردن طولانی فرم.' : 'A gift card in three steps. Nothing more, nothing less.' },
          { n: lang === 'fa' ? '۰۲' : '02', t: lang === 'fa' ? 'دقت' : 'Craft', d: lang === 'fa' ? 'هر طرح کارت توسط طراحان خانگی ما با دست ساخته شده.' : 'Every card design is drawn by our in-house studio.' },
          { n: lang === 'fa' ? '۰۳' : '03', t: lang === 'fa' ? 'احترام' : 'Respect', d: lang === 'fa' ? 'هرگز اطلاعات شما را نمی‌فروشیم. هرگز.' : 'We never sell your data. We never will.' }
        ].map((v, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="step" style={{ height: '100%' }}>
              <div className="step-num">{v.n}</div>
              <div className="step-title">{v.t}</div>
              <div className="step-desc">{v.d}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <style>{`@media (max-width: 800px) { .about-grid { grid-template-columns: 1fr !important; gap: 30px !important; } .vals { grid-template-columns: 1fr !important; } }`}</style>
    </main>
  );
}

function PageFAQ() {
  const { lang } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const [open, setOpen] = useState(0);
  return (
    <main className="page container" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <div style={{ textAlign: 'center', marginBottom: 80 }}>
        <div className="eyebrow">{lang === 'fa' ? 'سوالات' : 'Help'}</div>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 16, maxWidth: '20ch', marginInline: 'auto' }}>
          {lang === 'fa' ? 'هر سوالی داری، اینجا جواب می‌گیری.' : 'Questions, answered.'}
        </h1>
      </div>
      <div className="faq">
        {TCARD_DATA.FAQS.map((f, i) => (
          <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
            <div className="faq-q">
              <span style={{ textWrap: 'balance' }}>{f.q[lang]}</span>
              <span className="sign">+</span>
            </div>
            <div className="faq-a">{f.a[lang]}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

function PageContact() {
  const { lang } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); setForm({ name:'', email:'', subject:'', message:'' }); };
  return (
    <main className="page container" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'start' }} className="contact-grid">
        <div>
          <div className="eyebrow">{lang === 'fa' ? 'تماس' : 'Contact'}</div>
          <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 16, lineHeight: 1.05 }}>{t('contact_h')}</h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 20, fontSize: 17, maxWidth: '38ch' }}>{t('contact_d')}</p>

          <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { lbl: lang === 'fa' ? 'ایمیل' : 'Email', val: 'hello@t-card.co' },
              { lbl: lang === 'fa' ? 'تلفن' : 'Phone', val: '+1 (555) 240-9134' },
              { lbl: lang === 'fa' ? 'دفتر' : 'Office', val: lang === 'fa' ? 'تهران، خیابان ولیعصر' : '21 Rivington St, NY 10002' }
            ].map((x, i) => (
              <div key={i}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>{x.lbl}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{x.val}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} style={{ padding: 'clamp(28px, 4vw, 48px)', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-grid">
            <div className="field"><label>{t('f_name')}</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="field"><label>{t('f_email')}</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
          </div>
          <div className="field"><label>{lang === 'fa' ? 'موضوع' : 'Subject'}</label>
            <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required />
          </div>
          <div className="field"><label>{lang === 'fa' ? 'پیام شما' : 'Message'}</label>
            <textarea rows={6} value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
            {sent ? <><Icon.Check /> {lang === 'fa' ? 'ارسال شد' : 'Sent'}</> : <>{t('contact_send')} <Icon.Arrow /></>}
          </button>
        </form>
      </div>
      <style>{`@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </main>
  );
}

function PageHow() {
  const { lang, navigate } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  return (
    <main className="page">
      <section className="container" style={{ paddingBlock: 'clamp(60px, 9vw, 140px) 60px', textAlign: 'center' }}>
        <div className="eyebrow">{t('how_eye')}</div>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 18, maxWidth: '18ch', marginInline: 'auto' }}>
          {t('how_h')}
        </h1>
      </section>

      <section className="container section">
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

      <section className="container section">
        <div style={{ padding: 'clamp(40px, 6vw, 80px)', background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <h2 className="display" style={{ fontSize: 'var(--fs-h2)', maxWidth: '20ch', marginInline: 'auto' }}>
            {lang === 'fa' ? 'آماده‌اید شروع کنید؟' : 'Ready to send something thoughtful?'}
          </h2>
          <button className="btn btn-primary btn-lg" style={{ marginTop: 30 }} onClick={() => navigate('/shop')}>{t('shop_now')} <Icon.Arrow /></button>
        </div>
      </section>
    </main>
  );
}

function PageAccount() {
  const { lang, navigate } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const [tab, setTab] = useState('orders');
  const orders = useMemo(() => JSON.parse(localStorage.getItem('tcard.orders') || '[]'), [tab]);

  return (
    <main className="page container" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <div style={{ marginBottom: 60 }}>
        <div className="eyebrow">{t('acc_welcome')}</div>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 14 }}>
          {lang === 'fa' ? 'سلام، مهمان' : 'Hello, Guest'}
        </h1>
      </div>

      <div className="account-grid">
        <nav className="account-nav">
          {[
            ['orders', t('acc_orders')],
            ['saved', t('acc_saved')],
            ['profile', t('acc_profile')],
            ['settings', t('acc_settings')]
          ].map(([id, lbl]) => (
            <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{lbl}</button>
          ))}
          <div className="divider" style={{ margin: '16px 0' }} />
          <button>{t('acc_signout')}</button>
        </nav>

        <div>
          {tab === 'orders' && (
            orders.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', border: '1px dashed var(--line-strong)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 12 }}>
                  {lang === 'fa' ? 'هنوز سفارشی ندارید' : 'No orders yet'}
                </p>
                <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>{lang === 'fa' ? 'برای شروع، یک کارت انتخاب کنید.' : 'Send your first card to get started.'}</p>
                <button className="btn btn-primary" onClick={() => navigate('/shop')}>{t('shop_now')}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {orders.map(o => (
                  <div key={o.id} style={{ padding: 24, border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)', letterSpacing: '.1em' }}>{t('order_num')}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, marginTop: 2 }}>{o.id}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)' }}>{new Date(o.placedAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 2 }}>{TCARD_DATA.fmtPrice(o.total, lang)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
                      {o.items.map(item => {
                        const brand = TCARD_DATA.BRANDS.find(b => b.id === item.brandId);
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
            <div style={{ padding: 60, textAlign: 'center', border: '1px dashed var(--line-strong)', borderRadius: 'var(--radius-lg)', color: 'var(--ink-soft)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>{lang === 'fa' ? 'هنوز کارتی ذخیره نشده' : 'No saved cards yet'}</p>
            </div>
          )}

          {tab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
              <div className="field"><label>{t('f_name')}</label><input defaultValue="Guest" /></div>
              <div className="field"><label>{t('f_email')}</label><input defaultValue="guest@t-card.co" /></div>
              <div className="field"><label>{t('f_phone')}</label><input defaultValue="" placeholder="+1 555 ..." /></div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 10 }}>{lang === 'fa' ? 'ذخیره' : 'Save changes'}</button>
            </div>
          )}

          {tab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 500 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{lang === 'fa' ? 'اعلان‌ها' : 'Notifications'}</div>
                <label style={{ display: 'flex', justifyContent: 'space-between', padding: 16, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                  <span>{lang === 'fa' ? 'یادآور تولد دوستان' : 'Birthday reminders'}</span>
                  <input type="checkbox" defaultChecked />
                </label>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{lang === 'fa' ? 'دو-عاملی' : '2-factor auth'}</div>
                <label style={{ display: 'flex', justifyContent: 'space-between', padding: 16, border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
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

function PageLegal({ kind }) {
  const { lang } = useApp();
  const titles = {
    terms:   { en: 'Terms of Service', fa: 'شرایط استفاده' },
    privacy: { en: 'Privacy Policy',   fa: 'حریم خصوصی' },
    cookies: { en: 'Cookies',          fa: 'سیاست کوکی' }
  };
  return (
    <main className="page container" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)', maxWidth: 760 }}>
      <div className="eyebrow">{lang === 'fa' ? 'حقوقی' : 'Legal'}</div>
      <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 14, marginBottom: 40 }}>{titles[kind][lang]}</h1>
      <div style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          {lang === 'fa' ? 'آخرین به‌روزرسانی: ۲۰ اردیبهشت ۱۴۰۵' : 'Last updated: May 14, 2026'}
        </p>
        {[1,2,3,4].map(n => (
          <div key={n}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)', marginBottom: 10, marginTop: 20 }}>
              {lang === 'fa' ? `بخش ${['اول','دوم','سوم','چهارم'][n-1]}` : `Section ${n}`}
            </h3>
            <p>{lang === 'fa' ?
              'این بخش به توضیح خط‌مشی‌های ما در رابطه با استفاده از خدمات تی‌کارت می‌پردازد. با ادامه استفاده از خدمات ما، شما با این شرایط موافقت می‌کنید. ما متعهد به شفافیت کامل در ارتباط با کاربران خود هستیم.' :
              'This section outlines our policies regarding the use of T-Card services. By continuing to use our service, you agree to these terms. We are committed to full transparency in our relationship with users and partners.'}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

function PageNotFound() {
  const { lang, navigate } = useApp();
  return (
    <main className="page container" style={{ paddingBlock: 140, textAlign: 'center' }}>
      <div className="display italic" style={{ fontSize: 'clamp(80px, 16vw, 180px)', color: 'var(--accent)', lineHeight: 1 }}>404</div>
      <h1 className="display" style={{ fontSize: 'var(--fs-h2)', marginTop: 20 }}>
        {lang === 'fa' ? 'این صفحه پیدا نشد' : 'Page not found'}
      </h1>
      <p style={{ color: 'var(--ink-soft)', marginTop: 12, maxWidth: '40ch', marginInline: 'auto' }}>
        {lang === 'fa' ? 'صفحه‌ای که دنبالش بودید موجود نیست. بیایید به جایی برویم که هست.' : 'The page you were looking for doesn\'t exist. Let\'s get you back.'}
      </p>
      <button className="btn btn-primary btn-lg" style={{ marginTop: 30 }} onClick={() => navigate('/')}>
        {lang === 'fa' ? 'بازگشت به خانه' : 'Back to home'}
      </button>
    </main>
  );
}

Object.assign(window, { PageAbout, PageFAQ, PageContact, PageHow, PageAccount, PageLegal, PageNotFound });
