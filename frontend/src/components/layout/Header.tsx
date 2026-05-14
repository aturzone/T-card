import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { t as translate } from '@/data/format';

export function Header() {
  const { lang, setLang, theme, toggleTheme, cart, openCart, fmtNumber } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const navItems = [
    { id: 'shop', to: '/shop', label: translate('nav_shop', lang) },
    { id: 'how',  to: '/how',  label: translate('nav_how', lang) },
    { id: 'about', to: '/about', label: translate('nav_about', lang) },
    { id: 'faq',  to: '/faq',  label: translate('nav_faq', lang) },
  ];

  const isActive = (id: string) => location.pathname.startsWith('/' + id);

  return (
    <header className="header">
      <div className="container-x header-inner">
        <Logo />
        <nav className={`nav ${open ? 'open' : ''}`}>
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

        <div className="flex items-center gap-[6px]">
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
