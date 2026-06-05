import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { t as translate } from '@/data/format';

export function Header() {
  const { lang, setLang, cart, openCart, fmtNumber } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Live Tehran clock — updates every second
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
  const cityLabel = lang === 'fa' ? 'تهران' : 'TEHRAN';

  const navItems = [
    { id: 'shop',    to: '/shop',    label: translate('nav_shop', lang) },
    { id: 'about',   to: '/about',   label: translate('nav_about', lang) },
    { id: 'faq',     to: '/faq',     label: translate('nav_faq', lang) },
    { id: 'contact', to: '/contact', label: lang === 'fa' ? 'تماس' : 'Contact' },
  ];

  const isActive = (id: string) => location.pathname.startsWith('/' + id);

  return (
    <header className="header border-b border-line">
      <div className="container-x header-inner">
        <Logo size="clamp(22px, 4vw, 28px)" />
        <nav
          className={`nav ${open ? 'open' : ''} font-mono uppercase`}
          style={{ fontSize: 11, letterSpacing: '0.08em', gap: 28 }}
        >
          {navItems.map((n) => (
            <Link
              key={n.id}
              to={n.to}
              className={isActive(n.id) ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-[10px]">
          <div
            className="hidden md:block font-mono uppercase text-ink-mute"
            style={{ fontSize: 11, letterSpacing: '0.08em' }}
            aria-label="Tehran time"
          >
            {time} — {cityLabel}
          </div>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'fa' ? 'active' : ''} onClick={() => setLang('fa')}>فا</button>
          </div>
          <button className="icon-btn" onClick={() => navigate('/account')} aria-label="Account">
            <Icon.User />
          </button>
          <button className="icon-btn" onClick={openCart} aria-label="Cart">
            <Icon.Cart />
            {cartCount > 0 && <span className="cart-badge">{fmtNumber(cartCount)}</span>}
          </button>
          <button
            className="icon-btn mobile-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <Icon.Close /> : <Icon.Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
