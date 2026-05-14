import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import type { I18NKey } from '@/data/i18n';

export function How() {
  const { lang, t } = useApp();
  const navigate = useNavigate();

  return (
    <main className="page">
      <section className="container-x text-center" style={{ paddingBlock: 'clamp(60px, 9vw, 140px) 60px' }}>
        <div className="eyebrow">{t('how_eye')}</div>
        <h1 className="display mx-auto" style={{ fontSize: 'var(--fs-h1)', marginTop: 18, maxWidth: '18ch' }}>
          {t('how_h')}
        </h1>
      </section>

      <section className="container-x section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={n * 100}>
              <div className="step">
                <div className="step-num">{lang === 'fa' ? ['۰۱', '۰۲', '۰۳'][n - 1] : `0${n}`}</div>
                <div className="step-title">{t(`how_${n}_t` as I18NKey)}</div>
                <div className="step-desc">{t(`how_${n}_d` as I18NKey)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x section-padding">
        <div
          className="bg-bg-soft text-center"
          style={{ padding: 'clamp(40px, 6vw, 80px)', borderRadius: 'var(--radius-lg)' }}
        >
          <h2 className="display mx-auto" style={{ fontSize: 'var(--fs-h2)', maxWidth: '20ch' }}>
            {lang === 'fa' ? 'آماده‌اید شروع کنید؟' : 'Ready to send something thoughtful?'}
          </h2>
          <button className="btn btn-primary btn-lg" style={{ marginTop: 30 }} onClick={() => navigate('/shop')}>
            {t('shop_now')} <Icon.Arrow />
          </button>
        </div>
      </section>
    </main>
  );
}
