import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Reveal } from '@/components/ui/Reveal';
import type { I18NKey } from '@/data/i18n';

export function How() {
  const { lang, t } = useApp();
  const navigate = useNavigate();

  return (
    <main className="page">
      {/* LOCKUP HERO */}
      <section className="container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px) 60px' }}>
        <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
          {t('how_eye')} — 03 / 05
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
          {lang === 'fa' ? 'نحوه کار' : 'HOW IT WORKS'}
        </h1>
        <p
          className="text-ink-soft"
          style={{ marginTop: 24, maxWidth: '60ch', fontSize: 18, lineHeight: 1.6 }}
        >
          {t('how_h')}
        </p>
      </section>

      {/* NUMBERED EDITORIAL LIST */}
      <section className="container-x section-padding">
        <ol className="flex flex-col" style={{ listStyle: 'none', padding: 0, margin: 0, maxWidth: '60ch' }}>
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={n * 100}>
              <li
                className="grid items-start gap-6 border-t border-line"
                style={{ gridTemplateColumns: '64px 1fr', padding: '36px 0' }}
              >
                <div
                  className="font-mono text-ink-mute text-[12px]"
                  style={{ letterSpacing: '.08em', paddingTop: 8 }}
                >
                  {lang === 'fa' ? ['۰۱', '۰۲', '۰۳'][n - 1] : `0${n}`}
                </div>
                <div>
                  <div
                    className="font-display"
                    style={{
                      fontSize: 'clamp(28px, 4vw, 48px)',
                      fontWeight: 700,
                      letterSpacing: '-.03em',
                      lineHeight: 1.05,
                      color: 'var(--ink)',
                    }}
                  >
                    {t(`how_${n}_t` as I18NKey)}
                  </div>
                  <p className="text-ink-soft" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
                    {t(`how_${n}_d` as I18NKey)}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
          <li className="border-t border-line" style={{ listStyle: 'none' }} />
        </ol>
      </section>

      {/* CTA — typographic, single mono link */}
      <section className="container-x section-padding">
        <div className="border-t border-line" style={{ paddingTop: 48, paddingBottom: 48, maxWidth: '60ch' }}>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-.04em',
              lineHeight: 1.0,
              color: 'var(--ink)',
              maxWidth: '20ch',
            }}
          >
            {lang === 'fa' ? 'آماده‌اید شروع کنید؟' : 'Ready to send something thoughtful?'}
          </h2>
          <button
            className="font-mono uppercase text-[12px] inline-flex items-center gap-2"
            style={{
              background: 'var(--ink)',
              color: 'var(--bg)',
              padding: '14px 22px',
              marginTop: 28,
              letterSpacing: '.08em',
              borderRadius: 0,
            }}
            onClick={() => navigate('/shop')}
          >
            {t('shop_now')} →
          </button>
        </div>
      </section>
    </main>
  );
}
