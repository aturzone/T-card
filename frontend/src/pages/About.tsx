import { useApp } from '@/context/AppContext';
import { Reveal } from '@/components/ui/Reveal';

export function About() {
  const { lang, t } = useApp();

  const values = [
    { n: lang === 'fa' ? '۰۱' : '01', t: lang === 'fa' ? 'سادگی' : 'Simplicity', d: lang === 'fa' ? 'گیفت‌کارت در سه قدم. بدون پر کردن طولانی فرم.' : 'A gift card in three steps. Nothing more, nothing less.' },
    { n: lang === 'fa' ? '۰۲' : '02', t: lang === 'fa' ? 'دقت' : 'Craft', d: lang === 'fa' ? 'هر طرح کارت توسط طراحان خانگی ما با دست ساخته شده.' : 'Every card design is drawn by our in-house studio.' },
    { n: lang === 'fa' ? '۰۳' : '03', t: lang === 'fa' ? 'احترام' : 'Respect', d: lang === 'fa' ? 'هرگز اطلاعات شما را نمی‌فروشیم. هرگز.' : 'We never sell your data. We never will.' },
  ];

  // TODO(i18n): replace with t('hero_lockup_about') once Agent F adds the key.
  const lockup = 'ABOUT';

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <section style={{ marginBottom: 80 }}>
        <div
          className="font-mono uppercase text-ink-mute"
          style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 24 }}
        >
          02 / 12 &mdash; {lang === 'fa' ? 'درباره ما' : 'STUDIO'} &mdash; {lang === 'fa' ? 'استودیو' : 'EST. 2025'}
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'var(--fs-hero)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          {lockup}
        </h1>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[80px] items-start about-grid border-t border-line" style={{ paddingTop: 40 }}>
        <div>
          <h2
            className="font-display"
            style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.05 }}
          >
            {t('about_h')}
          </h2>
        </div>
        <div
          className="text-ink-soft flex flex-col gap-5"
          style={{ fontSize: 17, lineHeight: 1.7, paddingTop: 12 }}
        >
          <p>{t('about_p1')}</p>
          <p>{t('about_p2')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-line" style={{ marginTop: 100 }}>
        {values.map((v, i) => (
          <Reveal key={i} delay={i * 100}>
            <div
              className="border-r border-b border-line h-full"
              style={{ padding: 'clamp(24px, 3vw, 36px)' }}
            >
              <div
                className="font-mono text-ink-mute"
                style={{ fontSize: 12, letterSpacing: '0.08em' }}
              >
                {v.n}
              </div>
              <div
                className="font-display"
                style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 32 }}
              >
                {v.t}
              </div>
              <div
                className="text-ink-soft"
                style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6 }}
              >
                {v.d}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
