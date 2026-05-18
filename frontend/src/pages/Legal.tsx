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

const LOCKUP: Record<LegalKind, { en: string; fa: string }> = {
  terms:   { en: 'TERMS',   fa: 'شرایط' },
  privacy: { en: 'PRIVACY', fa: 'حریم' },
  cookies: { en: 'COOKIES', fa: 'کوکی‌ها' },
};

export function Legal({ kind }: LegalProps) {
  const { lang } = useApp();
  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)', maxWidth: '80ch' }}>
      {/* LOCKUP HERO */}
      <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
        {lang === 'fa' ? 'حقوقی' : 'Legal'} — 05 / 05
      </div>
      <h1
        className="display"
        style={{
          fontSize: 'var(--fs-hero)',
          fontWeight: 700,
          letterSpacing: '-.04em',
          lineHeight: 0.95,
          color: 'var(--ink)',
          marginTop: 18,
        }}
      >
        {LOCKUP[kind][lang]}
      </h1>
      <p
        className="font-display text-ink-soft"
        style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', marginTop: 18, letterSpacing: '-.01em' }}
      >
        {TITLES[kind][lang]}
      </p>

      <div className="font-mono uppercase text-ink-mute text-[12px]" style={{ letterSpacing: '.08em', marginTop: 32 }}>
        {lang === 'fa' ? 'آخرین به‌روزرسانی: ۲۰ اردیبهشت ۱۴۰۵' : 'Last updated: May 14, 2026'}
      </div>

      <div className="text-ink-soft flex flex-col" style={{ marginTop: 32, fontSize: 16, lineHeight: 1.8 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="border-t border-line" style={{ padding: '32px 0' }}>
            <h3
              className="font-display text-ink"
              style={{
                fontSize: 'clamp(22px, 2.4vw, 32px)',
                fontWeight: 700,
                letterSpacing: '-.02em',
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              {lang === 'fa' ? `بخش ${['اول', 'دوم', 'سوم', 'چهارم'][n - 1]}` : `Section ${n}`}
            </h3>
            <p>
              {lang === 'fa'
                ? 'این بخش به توضیح خط‌مشی‌های ما در رابطه با استفاده از خدمات تی‌کارت می‌پردازد. با ادامه استفاده از خدمات ما، شما با این شرایط موافقت می‌کنید. ما متعهد به شفافیت کامل در ارتباط با کاربران خود هستیم.'
                : 'This section outlines our policies regarding the use of T-Card services. By continuing to use our service, you agree to these terms. We are committed to full transparency in our relationship with users and partners.'}
            </p>
          </div>
        ))}
        <div className="border-t border-line" />
      </div>
    </main>
  );
}
