import { useApp } from '@/context/AppContext';
import { Reveal } from '@/components/ui/Reveal';

export function About() {
  const { lang, t } = useApp();

  const values = [
    { n: lang === 'fa' ? '۰۱' : '01', t: lang === 'fa' ? 'سادگی' : 'Simplicity', d: lang === 'fa' ? 'گیفت‌کارت در سه قدم. بدون پر کردن طولانی فرم.' : 'A gift card in three steps. Nothing more, nothing less.' },
    { n: lang === 'fa' ? '۰۲' : '02', t: lang === 'fa' ? 'دقت' : 'Craft', d: lang === 'fa' ? 'هر طرح کارت توسط طراحان خانگی ما با دست ساخته شده.' : 'Every card design is drawn by our in-house studio.' },
    { n: lang === 'fa' ? '۰۳' : '03', t: lang === 'fa' ? 'احترام' : 'Respect', d: lang === 'fa' ? 'هرگز اطلاعات شما را نمی‌فروشیم. هرگز.' : 'We never sell your data. We never will.' },
  ];

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[80px] items-start about-grid">
        <div>
          <div className="eyebrow">{lang === 'fa' ? 'درباره ما' : 'About'}</div>
          <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 16, lineHeight: 1.05 }}>{t('about_h')}</h1>
        </div>
        <div className="text-ink-soft flex flex-col gap-5" style={{ fontSize: 17, lineHeight: 1.7, paddingTop: 12 }}>
          <p>{t('about_p1')}</p>
          <p>{t('about_p2')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10" style={{ marginTop: 100 }}>
        {values.map((v, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="step h-full">
              <div className="step-num">{v.n}</div>
              <div className="step-title">{v.t}</div>
              <div className="step-desc">{v.d}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
