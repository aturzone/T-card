import { useApp } from '@/context/AppContext';

type LegalKind = 'terms' | 'privacy' | 'cookies';

interface LegalProps {
  kind: LegalKind;
}

const TITLES: Record<LegalKind, { en: string; fa: string }> = {
  terms:   { en: 'Terms of Service', fa: 'شرایط استفاده' },
  privacy: { en: 'Privacy Policy',   fa: 'حریم خصوصی' },
  cookies: { en: 'Cookies',          fa: 'سیاست کوکی' },
};

export function Legal({ kind }: LegalProps) {
  const { lang } = useApp();
  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)', maxWidth: 760 }}>
      <div className="eyebrow">{lang === 'fa' ? 'حقوقی' : 'Legal'}</div>
      <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 14, marginBottom: 40 }}>
        {TITLES[kind][lang]}
      </h1>
      <div className="text-ink-soft flex flex-col gap-[18px]" style={{ fontSize: 16, lineHeight: 1.8 }}>
        <p className="font-mono uppercase text-ink-mute text-[12px]" style={{ letterSpacing: '.1em' }}>
          {lang === 'fa' ? 'آخرین به‌روزرسانی: ۲۰ اردیبهشت ۱۴۰۵' : 'Last updated: May 14, 2026'}
        </p>
        {[1, 2, 3, 4].map((n) => (
          <div key={n}>
            <h3 className="font-display text-ink" style={{ fontSize: 24, marginBottom: 10, marginTop: 20 }}>
              {lang === 'fa' ? `بخش ${['اول', 'دوم', 'سوم', 'چهارم'][n - 1]}` : `Section ${n}`}
            </h3>
            <p>
              {lang === 'fa'
                ? 'این بخش به توضیح خط‌مشی‌های ما در رابطه با استفاده از خدمات تی‌کارت می‌پردازد. با ادامه استفاده از خدمات ما، شما با این شرایط موافقت می‌کنید. ما متعهد به شفافیت کامل در ارتباط با کاربران خود هستیم.'
                : 'This section outlines our policies regarding the use of T-Card services. By continuing to use our service, you agree to these terms. We are committed to full transparency in our relationship with users and partners.'}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
