// ============================================
// T-Card — Shared components
// ============================================

const { useState, useEffect, useRef, useContext, createContext, useMemo } = React;

// ===== App context =====
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ===== Icons (inline SVG, hairline) =====
const Icon = {
  Search: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>,
  Cart: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M3 4h2l2.4 12.5a2 2 0 0 0 2 1.5h8.6a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="21" r="1.2"/><circle cx="18" cy="21" r="1.2"/></svg>,
  User: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>,
  Sun: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/></svg>,
  Moon: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8z"/></svg>,
  Close: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M5 5l14 14M19 5L5 19"/></svg>,
  Arrow: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  ArrowLeft: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="m5 12 5 5L20 7"/></svg>,
  Menu: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>,
  Star: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}><path d="m12 2 3.1 6.3 7 1-5 5 1.2 7L12 18l-6.3 3.3L7 14.3l-5-5 7-1z"/></svg>,
  Shield: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/></svg>,
  Bolt: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
  Gift: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18M12 8v13M8 8a2 2 0 1 1 0-4c2 0 4 4 4 4s2-4 4-4a2 2 0 0 1 0 4"/></svg>,
};

// ===== Logo =====
function Logo({ onClick, size }) {
  const { lang } = useApp();
  return (
    <a href="#/" onClick={onClick} className="logo" style={size ? { fontSize: size } : null}>
      <span className="logo-mark italic">T</span>
      <span>{lang === 'fa' ? 'تی‌کارت' : 'T-Card'}</span>
    </a>
  );
}

// ===== Header =====
function Header() {
  const { route, navigate, lang, setLang, theme, toggleTheme, cart, openCart } = useApp();
  const [open, setOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const navItems = [
    { id: 'shop', href: '#/shop', label: TCARD_DATA.t('nav_shop', lang) },
    { id: 'how',  href: '#/how',  label: TCARD_DATA.t('nav_how', lang) },
    { id: 'about',href: '#/about',label: TCARD_DATA.t('nav_about', lang) },
    { id: 'faq',  href: '#/faq',  label: TCARD_DATA.t('nav_faq', lang) }
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />
        <nav className={`nav ${open ? 'open' : ''}`}>
          {navItems.map(n => (
            <a key={n.id} href={n.href} className={route.startsWith('/' + n.id) ? 'active' : ''}
               onClick={() => setOpen(false)}>{n.label}</a>
          ))}
        </nav>

        <div className="row" style={{ gap: 6 }}>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'fa' ? 'active' : ''} onClick={() => setLang('fa')}>فا</button>
          </div>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Icon.Moon /> : <Icon.Sun />}
          </button>
          <button className="icon-btn" onClick={() => navigate('/account')} aria-label="Account">
            <Icon.User />
          </button>
          <button className="icon-btn" onClick={openCart} aria-label="Cart">
            <Icon.Cart />
            {cartCount > 0 && <span className="cart-badge">{TCARD_DATA.fmtNumber(cartCount, lang)}</span>}
          </button>
          <button className="icon-btn mobile-toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <Icon.Close /> : <Icon.Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

// ===== Footer =====
function Footer() {
  const { lang, navigate } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo size={28} />
            <p style={{ marginTop: 16, color: 'var(--ink-soft)', fontSize: 14, maxWidth: '32ch', lineHeight: 1.6 }}>
              {t('ft_tagline')}
            </p>
          </div>
          <div>
            <h4>{t('ft_company')}</h4>
            <ul>
              <li><a href="#/about">{t('nav_about')}</a></li>
              <li><a href="#/contact">{lang === 'fa' ? 'تماس' : 'Contact'}</a></li>
              <li><a href="#/how">{t('nav_how')}</a></li>
              <li><a href="#/shop">{t('nav_shop')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('ft_support')}</h4>
            <ul>
              <li><a href="#/faq">{t('nav_faq')}</a></li>
              <li><a href="#/account">{t('nav_account')}</a></li>
              <li><a href="#/contact">{lang === 'fa' ? 'تماس با ما' : 'Help center'}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('ft_legal')}</h4>
            <ul>
              <li><a href="#/terms">{lang === 'fa' ? 'شرایط استفاده' : 'Terms'}</a></li>
              <li><a href="#/privacy">{lang === 'fa' ? 'حریم خصوصی' : 'Privacy'}</a></li>
              <li><a href="#/cookies">{lang === 'fa' ? 'کوکی‌ها' : 'Cookies'}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('ft_rights')}</span>
          <span>{lang === 'fa' ? 'ساخته شده در شهر' : 'Made in the city.'}</span>
        </div>
      </div>
    </footer>
  );
}

// ===== Gift card visual =====
function GCard({ brand, amount, lang: langProp, mini }) {
  const { lang: langCtx } = useApp() || {};
  const lang = langProp || langCtx || 'en';
  const { palette, name, initial, tagline } = brand;
  const bg = `linear-gradient(135deg, ${palette.a} 0%, ${palette.b} 100%)`;
  return (
    <div className="gcard" style={{ background: bg }}>
      <div className="gcard-pattern">
        <CardPattern brandId={brand.id} />
      </div>
      <div className="gcard-inner">
        <div className="gcard-brand">
          <span className="logo-mark italic" style={{ width: mini ? 18 : 30, height: mini ? 18 : 30, fontSize: mini ? 11 : 18, background: palette.accent, color: palette.b }}>{initial}</span>
          {!mini && (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: 16 }}>{name[lang] || name.en}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, opacity: .7, marginTop: 4, letterSpacing: '.14em' }}>GIFT CARD</span>
            </div>
          )}
        </div>
        {!mini && (
          <div className="gcard-bottom">
            <div className="gcard-chip" style={{ background: `linear-gradient(135deg, ${palette.accent}, rgba(255,255,255,.4))` }} />
            {amount && (
              <div className="gcard-amount" style={{ color: palette.accent }}>
                {TCARD_DATA.fmtPrice(amount, lang)}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="gcard-shine" />
    </div>
  );
}

// ===== Product tile (catalog) =====
function ProductTile({ brand, onClick }) {
  const { lang } = useApp();
  return (
    <div className="product-tile" onClick={onClick}>
      <GCard brand={brand} amount={brand.amounts[0]} />
      <div className="product-meta">
        <div>
          <div className="product-name">{brand.name[lang] || brand.name.en}</div>
          <div className="product-cat">
            {TCARD_DATA.CATEGORIES.find(c => c.id === brand.cat)?.[lang]}
            <span style={{ margin: '0 6px', opacity: .5 }}>·</span>
            <Icon.Star style={{ display: 'inline-block', verticalAlign: '-2px', color: 'var(--gold)' }}/> {brand.rating}
          </div>
        </div>
        <div className="product-price">
          {lang === 'fa' ? 'از ' : 'from '}{TCARD_DATA.fmtPrice(brand.amounts[0], lang)}
        </div>
      </div>
    </div>
  );
}

// ===== Reveal-on-scroll wrapper =====
function Reveal({ children, delay = 0, style }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''}`} style={{ ...(style || {}), transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ===== Toast =====
function Toast({ message, show }) {
  return <div className={`toast ${show ? 'show' : ''}`}>{message}</div>;
}

// ===== Cart Drawer =====
function CartDrawer() {
  const { cart, cartOpen, closeCart, removeFromCart, updateQty, navigate, lang } = useApp();
  const t = (k) => TCARD_DATA.t(k, lang);
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const fee = subtotal * 0.02;
  const total = subtotal + fee;

  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? 'open' : ''}`} onClick={closeCart} />
      <aside className={`drawer ${cartOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <h3>{t('cart')}</h3>
          <button className="icon-btn" onClick={closeCart}><Icon.Close /></button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 10 }}>{t('cart_empty')}</div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{t('cart_empty_d')}</div>
              <button className="btn btn-primary" style={{ marginTop: 28 }} onClick={() => { closeCart(); navigate('/shop'); }}>
                {t('shop_now')}
              </button>
            </div>
          ) : cart.map(item => {
            const brand = TCARD_DATA.BRANDS.find(b => b.id === item.brandId);
            return (
              <div className="cart-item" key={item.id}>
                <div className="mini-card"><GCard brand={brand} mini /></div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{brand.name[lang] || brand.name.en}</div>
                  <div className="cart-item-meta">{TCARD_DATA.fmtPrice(item.amount, lang)} {item.recipient ? `· ${item.recipient}` : ''}</div>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, minWidth: 18, textAlign: 'center' }}>{TCARD_DATA.fmtNumber(item.qty, lang)}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="cart-item-price">{TCARD_DATA.fmtPrice(item.amount * item.qty, lang)}</div>
                  <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                    {lang === 'fa' ? 'حذف' : 'Remove'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="cart-total-row"><span>{t('subtotal')}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(subtotal, lang)}</span></div>
            <div className="cart-total-row"><span>{t('fee')}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(fee, lang)}</span></div>
            <div className="cart-total-row grand"><span>{t('total')}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{TCARD_DATA.fmtPrice(total, lang)}</span></div>
            <button className="btn btn-primary btn-block btn-lg" onClick={() => { closeCart(); navigate('/checkout'); }}>
              {t('checkout')} <Icon.Arrow />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

Object.assign(window, {
  AppContext, useApp, Icon, Logo, Header, Footer, GCard, ProductTile, Reveal, Toast, CartDrawer
});
