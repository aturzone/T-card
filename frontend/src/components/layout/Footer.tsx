import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export function Footer() {
  const { lang, t } = useApp();
  const lockup = lang === 'fa' ? 'تی‌کارت' : 'TCARD';
  return (
    <footer className="footer border-t border-line">
      <div className="container-x">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-[60px] py-[60px] font-mono text-[12px] uppercase" style={{ letterSpacing: '0.08em' }}>
          <div>
            <h4>{t('ft_company')}</h4>
            <ul>
              <li><Link to="/about">{t('nav_about')}</Link></li>
              <li><Link to="/how">{t('nav_how')}</Link></li>
              <li><Link to="/contact">{lang === 'fa' ? 'تماس' : 'Contact'}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('ft_support')}</h4>
            <ul>
              <li><Link to="/faq">{t('nav_faq')}</Link></li>
              <li><Link to="/contact">{lang === 'fa' ? 'پشتیبانی' : 'Help center'}</Link></li>
              <li><Link to="/account">{t('nav_account')}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('ft_legal')}</h4>
            <ul>
              <li><Link to="/terms">{lang === 'fa' ? 'شرایط استفاده' : 'Terms'}</Link></li>
              <li><Link to="/privacy">{lang === 'fa' ? 'حریم خصوصی' : 'Privacy'}</Link></li>
              <li><Link to="/cookies">{lang === 'fa' ? 'کوکی‌ها' : 'Cookies'}</Link></li>
            </ul>
          </div>
        </div>

        <div
          className="font-display select-none"
          aria-hidden="true"
          style={{
            fontSize: 'clamp(96px, 18vw, 240px)',
            fontWeight: 700,
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: 'var(--ink)',
            opacity: 0.92,
            borderTop: '1px solid var(--line)',
            paddingTop: 40,
            marginTop: 20,
          }}
        >
          {lockup}
        </div>

        <div className="flex justify-between flex-wrap gap-3 pt-[30px] pb-[30px] border-t border-line font-mono text-[12px] text-ink-mute uppercase" style={{ letterSpacing: '0.08em' }}>
          <span>{t('ft_rights')}</span>
          <span>{lang === 'fa' ? 'ساخته شده در شهر' : 'Made in the city.'}</span>
        </div>
      </div>
    </footer>
  );
}
