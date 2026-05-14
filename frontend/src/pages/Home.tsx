import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { GCard } from '@/components/product/GCard';
import { ProductTile } from '@/components/product/ProductTile';
import { BRANDS } from '@/data/brands';
import { CATEGORIES } from '@/data/categories';
import { TESTIMONIALS } from '@/data/testimonials';
import type { I18NKey } from '@/data/i18n';

export function Home() {
  const { lang, t } = useApp();
  const navigate = useNavigate();
  const featured = BRANDS.slice(0, 4);

  return (
    <main className="page">
      {/* HERO */}
      <section className="container-x relative" style={{ paddingBlock: 'clamp(60px, 10vw, 120px) clamp(40px, 6vw, 80px)' }}>
        <div className="hero-ambient" aria-hidden="true" />
        <div className="hero-grid grid items-center gap-10 lg:gap-[80px] lg:[grid-template-columns:1.1fr_1fr]">
          <div>
            <div className="eyebrow">{t('hero_eyebrow')}</div>
            <h1 className="display hero-title text-hero" style={{ marginTop: 18 }}>
              {t('hero_title_a')}<br />
              <span className="italic" style={{ color: 'var(--accent)' }}>{t('hero_title_b')}</span>
            </h1>
            <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: '50ch', marginTop: 28, lineHeight: 1.55 }}>{t('hero_sub')}</p>
            <div className="flex gap-3 flex-wrap" style={{ marginTop: 40 }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
                {t('shop_now')} <Icon.Arrow />
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/how')}>{t('learn')}</button>
            </div>
            <div className="hero-stats flex gap-10 flex-wrap" style={{ marginTop: 56 }}>
              <div>
                <div className="hero-stat-num font-display text-[38px] leading-none">{lang === 'fa' ? '۸۰+' : '80+'}</div>
                <div className="font-mono uppercase text-ink-mute text-[12px] mt-1.5" style={{ letterSpacing: '.08em' }}>{t('stat_brands')}</div>
              </div>
              <div>
                <div className="hero-stat-num font-display text-[38px] leading-none">{lang === 'fa' ? '۹۰ ثانیه' : '90s'}</div>
                <div className="font-mono uppercase text-ink-mute text-[12px] mt-1.5" style={{ letterSpacing: '.08em' }}>{t('stat_delivery')}</div>
              </div>
              <div>
                <div className="hero-stat-num font-display text-[38px] leading-none">4.9<span style={{ fontSize: 18, opacity: 0.5 }}>/5</span></div>
                <div className="font-mono uppercase text-ink-mute text-[12px] mt-1.5" style={{ letterSpacing: '.08em' }}>{t('stat_rating')}</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card"><GCard brand={BRANDS[1]} amount={100} /></div>
            <div className="hero-card"><GCard brand={BRANDS[3]} amount={250} /></div>
            <div className="hero-card"><GCard brand={BRANDS[5]} amount={150} /></div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-x section-padding">
        <div className="flex justify-between items-end gap-6 flex-wrap" style={{ marginBottom: 56 }}>
          <div>
            <div className="eyebrow">{t('featured_eye')}</div>
            <h2 className="font-display max-w-[22ch] leading-[1.05]" style={{ marginTop: 12, fontSize: 'var(--fs-h2)' }}>{t('featured_h')}</h2>
            <p className="text-ink-soft max-w-[36ch]" style={{ marginTop: 12 }}>{t('featured_d')}</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/shop')}>{t('view_all')} <Icon.Arrow /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-9 md:gap-y-11">
          {featured.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <ProductTile brand={b} onClick={() => navigate('/product/' + b.id)} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x" style={{ paddingBlock: 'clamp(40px, 6vw, 80px)' }}>
        <div className="flex justify-between items-end gap-6 flex-wrap" style={{ marginBottom: 32 }}>
          <div>
            <div className="eyebrow">{t('cats_eye')}</div>
            <h2 className="font-display max-w-[22ch] leading-[1.05]" style={{ marginTop: 12, fontSize: 'var(--fs-h2)' }}>{t('cats_h')}</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.slice(1).map((c) => (
            <a key={c.id} className="cat-chip" href={`#/shop?cat=${c.id}`}>{c[lang]}</a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-x section-padding" id="how">
        <div className="flex justify-between items-end gap-6 flex-wrap" style={{ marginBottom: 56 }}>
          <div>
            <div className="eyebrow">{t('how_eye')}</div>
            <h2 className="font-display max-w-[22ch] leading-[1.05]" style={{ marginTop: 12, fontSize: 'var(--fs-h2)' }}>{t('how_h')}</h2>
          </div>
        </div>
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

      {/* TESTIMONIALS */}
      <section className="container-x section-padding">
        <div className="flex justify-between items-end gap-6 flex-wrap" style={{ marginBottom: 56 }}>
          <div>
            <div className="eyebrow">{t('testi_eye')}</div>
            <h2 className="font-display max-w-[22ch] leading-[1.05]" style={{ marginTop: 12, fontSize: 'var(--fs-h2)' }}>
              {lang === 'fa' ? 'مردم درباره ما چه می‌گویند' : 'What people are saying'}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 md:gap-x-9 md:gap-y-11">
          {TESTIMONIALS.map((tt, i) => (
            <Reveal key={i} delay={i * 80}>
              <figure
                className="border border-line bg-bg-card h-full m-0 flex flex-col justify-between gap-6"
                style={{ padding: 32, borderRadius: 'var(--radius-lg)' }}
              >
                <blockquote className="font-display m-0" style={{ fontSize: 22, lineHeight: 1.4, textWrap: 'pretty' as 'pretty' }}>
                  <span className="italic" style={{ color: 'var(--accent)' }}>“</span>
                  {tt.quote[lang]}
                  <span className="italic" style={{ color: 'var(--accent)' }}>”</span>
                </blockquote>
                <figcaption>
                  <div className="text-[14px] font-medium">{tt.name[lang]}</div>
                  <div className="text-[12px] text-ink-mute mt-0.5">{tt.role[lang]}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x section-padding">
        <Reveal>
          <div
            className="grid items-center relative overflow-hidden gap-10 cta-card"
            style={{
              padding: 'clamp(50px, 8vw, 100px) clamp(30px, 6vw, 80px)',
              background: 'var(--ink)',
              color: 'var(--bg)',
              borderRadius: 'var(--radius-lg)',
              gridTemplateColumns: '1.4fr 1fr',
            }}
          >
            <div>
              <h2 className="display" style={{ fontSize: 'var(--fs-h1)', maxWidth: '14ch', lineHeight: 1.05 }}>{t('cta_h')}</h2>
              <p style={{ opacity: 0.7, marginTop: 18, maxWidth: '42ch', fontSize: 16 }}>{t('cta_sub')}</p>
              <button
                className="btn btn-lg"
                style={{ background: 'var(--bg)', color: 'var(--ink)', marginTop: 32 }}
                onClick={() => navigate('/shop')}
              >
                {t('cta_btn')} <Icon.Arrow />
              </button>
            </div>
            <div style={{ position: 'relative', height: 280 }}>
              <div style={{ position: 'absolute', top: 0, right: '5%', width: '78%', transform: 'rotate(-6deg)' }}>
                <GCard brand={BRANDS[6]} amount={50} />
              </div>
              <div style={{ position: 'absolute', top: 60, right: '20%', width: '78%', transform: 'rotate(8deg)' }}>
                <GCard brand={BRANDS[8]} amount={100} />
              </div>
            </div>
          </div>
          <style>{`@media (max-width: 800px) { .cta-card { grid-template-columns: 1fr !important; } }`}</style>
        </Reveal>
      </section>
    </main>
  );
}
