import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const { lang, t } = useApp();
  return (
    <footer className="footer">
      <div className="container-x">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:[grid-template-columns:1.5fr_repeat(3,1fr)] gap-10 md:gap-[60px] mb-[60px]">
          <div>
            <Logo size={28} />
            <p style={{ marginTop: 16, color: 'var(--ink-soft)', fontSize: 14, maxWidth: '32ch', lineHeight: 1.6 }}>
              {t('ft_tagline')}
            </p>
          </div>
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
        <div className="flex justify-between flex-wrap gap-3 pt-[30px] border-t border-line font-mono text-[12px] text-ink-mute">
          <span>{t('ft_rights')}</span>
          <span>{lang === 'fa' ? 'ساخته شده در شهر' : 'Made in the city.'}</span>
        </div>
      </div>
    </footer>
  );
}
