import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Reveal } from '@/components/ui/Reveal';
import { GCard } from '@/components/product/GCard';
import { Icon } from '@/components/ui/Icon';
import { ProductTile } from '@/components/product/ProductTile';
import { Statue3DStatic } from '@/components/three';
import { BRANDS } from '@/data/brands';
import { CATEGORIES } from '@/data/categories';
import { TESTIMONIALS } from '@/data/testimonials';
import type { I18NKey } from '@/data/i18n';

function useTehranClock(lang: 'en' | 'fa') {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
}

const Statue3D = lazy(() => import('@/components/three/Statue3D'));

function useHeroScrollProgress(heroRef: React.RefObject<HTMLElement>) {
  // 0..1 mapped across the hero's full scroll range (top sticks until bottom).
  const ref = useRef(0);
  const [stateP, setStateP] = useState(0); // for UI bindings that need re-render
  useEffect(() => {
    const tick = () => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const sticky = -rect.top;
      const max = Math.max(1, rect.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, sticky / max));
      ref.current = p;
      setStateP(p);
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
    };
  }, [heroRef]);
  return { getter: () => ref.current, p: stateP };
}

export function Home() {
  const { lang, t, theme } = useApp();
  const navigate = useNavigate();
  const featured = BRANDS.slice(0, 4);

  const heroRef = useRef<HTMLElement>(null);
  const { getter: scrollProgress, p } = useHeroScrollProgress(heroRef);
  const time = useTehranClock(lang);
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setShow3D(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setShow3D(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // 4-stage editorial — each stage has its own lockup + caption.
  const STAGES: { lockup: string; caption: { top: string; sub: string } }[] = [
    {
      lockup: t('hero_lockup_home'),
      caption: { top: 'T-CARD STUDIO', sub: 'CONTEMPORARY GIFT CARDS — BASED IN TEHRAN' },
    },
    {
      lockup: lang === 'fa' ? 'هنر' : 'CRAFT',
      caption: { top: 'SIDENOTE', sub: 'Every card design hand-drawn by the studio. No stock art, no AI.' },
    },
    {
      lockup: lang === 'fa' ? 'برندها' : 'BRANDS',
      caption: { top: 'COLLECTION', sub: '80+ partners — Amazon, Steam, PlayStation, Netflix, and more.' },
    },
    {
      lockup: t('cta_buy_gift').replace(/[→↗←↑↓]/g, '').trim() || 'BUY',
      caption: { top: 'NEXT', sub: 'Scroll to the gallery, or jump straight to the shop.' },
    },
  ];
  const stageIdx = Math.min(3, Math.floor(p * 4 + 1e-6));
  const stage = STAGES[stageIdx];
  const stageBlend = Math.max(0, Math.min(1, p * 4 - stageIdx));

  return (
    <main className="page">
      {/* HERO SCROLLJACK — 4 sticky scroll sections sharing the bust canvas */}
      <section
        ref={heroRef}
        className="hero-cinema relative"
        style={{ minHeight: '400vh' }}
      >
        {/* Sticky stage — the bust + lockup + captions stay pinned for 4 viewports of scroll */}
        <div
          className="sticky overflow-hidden"
          style={{ top: 0, height: '100vh' }}
        >
          {/* L0 — Full-bleed Statue3D background */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            {show3D ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-ink-mute">
                    <Statue3DStatic className="w-1/2 max-w-md" />
                  </div>
                }
              >
                <Statue3D scrollProgress={scrollProgress} theme={theme} />
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-mute">
                <Statue3DStatic className="w-3/4 max-w-md" />
              </div>
            )}
          </div>

          {/* L1 — Per-stage giant lockup with mix-blend-difference; each lockup
              fades in/out around its stage boundary so the swap reads as a
              soft cross-dissolve, not a jump. */}
          {STAGES.map((s, i) => {
            const dist = Math.abs(p * 4 - i - 0.5);
            const op = Math.max(0, 1 - dist * 1.4);
            return (
              <h1
                key={i}
                className="hero-lockup font-display absolute pointer-events-none"
                style={{
                  top: '6vh',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 'var(--fs-mega)',
                  fontWeight: 700,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.85,
                  color: '#ffffff',
                  opacity: op,
                  zIndex: 1,
                  mixBlendMode: 'difference',
                  whiteSpace: 'nowrap',
                  margin: 0,
                  transition: 'opacity .25s linear',
                }}
              >
                {s.lockup}
              </h1>
            );
          })}

          {/* L2 — Mono corner captions (museum specimen card) */}
          <div
            className="container-x relative h-full"
            style={{ zIndex: 3, height: '100vh' }}
          >
            <div className="absolute mono-corner" style={{ top: 24, left: 24 }}>
              {stage.caption.top}<br />
              <span style={{ opacity: 0.75 }}>{stage.caption.sub}</span>
            </div>
            <div
              className="absolute mono-corner text-right"
              style={{ top: 24, right: 24 }}
            >
              {p < 0.95 ? 'KEEP SCROLLING ↓' : 'GALLERY BELOW ↓'}<br />
              {time} &mdash; {t('eyebrow_tehran')}
            </div>
            <div className="absolute mono-corner" style={{ bottom: 48, left: 24 }}>
              80+ {t('stat_brands')} · 90s {t('stat_delivery')}<br />
              4.9 / 5 {t('stat_rating')} · 2026
            </div>
            <button
              className="absolute mono-corner hover:opacity-70"
              style={{
                bottom: 48,
                right: 24,
                borderBottom: '1px solid var(--ink)',
                padding: '8px 0',
                transition: 'opacity .35s var(--ease)',
                color: 'var(--ink)',
              }}
              onClick={() => navigate('/shop')}
            >
              {t('cta_buy_gift')}
            </button>

            {/* Stage indicator pill — bottom centre */}
            <div
              className="absolute"
              style={{
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 6,
                zIndex: 4,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: i === stageIdx ? 28 : 12,
                    height: 2,
                    background: 'var(--ink)',
                    opacity: i === stageIdx ? 0.9 : 0.25,
                    transition: 'all .35s var(--ease)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* invisible — silences unused vars when stageBlend isn't read elsewhere */}
        <span style={{ display: 'none' }} aria-hidden>{stageBlend}</span>
      </section>

      {/* FEATURED — editorial 2/3-col, hairline dividers */}
      <section className="container-x section-padding">
        <div className="border-t border-line" style={{ paddingTop: 24, marginBottom: 40 }}>
          <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
            {t('featured_eye')} — 01
          </div>
          <h2
            className="font-display"
            style={{ fontSize: 'var(--fs-hero)', fontWeight: 700, letterSpacing: '-.04em', lineHeight: 0.95, marginTop: 18, color: 'var(--ink)' }}
          >
            {t('featured_h')}
          </h2>
          <div className="flex justify-between items-end gap-6 flex-wrap" style={{ marginTop: 18 }}>
            <p className="text-ink-soft max-w-[48ch]">{t('featured_d')}</p>
            <button className="font-mono uppercase text-[12px]" style={{ letterSpacing: '.08em' }} onClick={() => navigate('/shop')}>
              {t('view_all')} →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-line">
          {featured.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <div className="border-b border-line lg:[&:not(:nth-child(3n))]:border-e sm:[&:nth-child(2n)]:border-e-0 lg:[&:nth-child(2n)]:border-e sm:[&:not(:nth-child(2n))]:border-e" style={{ padding: '28px 24px' }}>
                <ProductTile brand={b} onClick={() => navigate('/product/' + b.id)} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES — mono pill row */}
      <section className="container-x" style={{ paddingBlock: 'clamp(40px, 6vw, 80px)' }}>
        <div className="border-t border-line" style={{ paddingTop: 24, marginBottom: 32 }}>
          <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
            {t('cats_eye')} — 02
          </div>
          <h2
            className="font-display"
            style={{ fontSize: 'var(--fs-hero)', fontWeight: 700, letterSpacing: '-.04em', lineHeight: 0.95, marginTop: 18, color: 'var(--ink)' }}
          >
            {t('cats_h')}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.slice(1).map((c) => (
            <a
              key={c.id}
              className="font-mono text-[12px] border border-line hover:border-ink"
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-pill)', letterSpacing: '.02em' }}
              href={`#/shop?cat=${c.id}`}
            >
              {c[lang]}
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — numbered editorial list */}
      <section className="container-x section-padding" id="how">
        <div className="border-t border-line" style={{ paddingTop: 24, marginBottom: 32 }}>
          <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
            {t('how_eye')} — 03
          </div>
          <h2
            className="font-display"
            style={{ fontSize: 'var(--fs-hero)', fontWeight: 700, letterSpacing: '-.04em', lineHeight: 0.95, marginTop: 18, color: 'var(--ink)' }}
          >
            {t('how_h')}
          </h2>
        </div>
        <ol className="flex flex-col" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={n * 100}>
              <li
                className="grid items-start gap-6 md:gap-12 border-t border-line"
                style={{ gridTemplateColumns: '80px 1fr', padding: '36px 0' }}
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
                    style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.05, color: 'var(--ink)' }}
                  >
                    {t(`how_${n}_t` as I18NKey)}
                  </div>
                  <p className="text-ink-soft max-w-[52ch]" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
                    {t(`how_${n}_d` as I18NKey)}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
          <li className="border-t border-line" style={{ listStyle: 'none' }} />
        </ol>
      </section>

      {/* TESTIMONIALS — vertical stack of single large quotes */}
      <section className="container-x section-padding">
        <div className="border-t border-line" style={{ paddingTop: 24, marginBottom: 32 }}>
          <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
            {t('testi_eye')} — 04
          </div>
          <h2
            className="font-display"
            style={{ fontSize: 'var(--fs-hero)', fontWeight: 700, letterSpacing: '-.04em', lineHeight: 0.95, marginTop: 18, color: 'var(--ink)' }}
          >
            {lang === 'fa' ? 'مردم درباره ما چه می‌گویند' : 'What people are saying'}
          </h2>
        </div>
        <div className="flex flex-col">
          {TESTIMONIALS.map((tt, i) => (
            <Reveal key={i} delay={i * 80}>
              <figure
                className="border-t border-line m-0"
                style={{ padding: '48px 0' }}
              >
                <blockquote
                  className="font-display m-0"
                  style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.2, maxWidth: '32ch', color: 'var(--ink)', textWrap: 'pretty' as 'pretty' }}
                >
                  “{tt.quote[lang]}”
                </blockquote>
                <figcaption
                  className="font-mono uppercase text-ink-mute text-[11px]"
                  style={{ letterSpacing: '.08em', marginTop: 20 }}
                >
                  — {tt.name[lang]}, {tt.role[lang]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>
      </section>

      {/* CTA — dark surface, sharp button */}
      <section className="container-x section-padding">
        <Reveal>
          <div
            className="grid items-center relative overflow-hidden gap-10 cta-card"
            style={{
              padding: 'clamp(50px, 8vw, 100px) clamp(30px, 6vw, 80px)',
              background: 'var(--ink)',
              color: 'var(--bg)',
              gridTemplateColumns: '1.4fr 1fr',
            }}
          >
            <div>
              <div
                className="font-mono uppercase text-[11px]"
                style={{ letterSpacing: '.08em', opacity: 0.6 }}
              >
                {t('featured_eye')} — 05
              </div>
              <h2
                className="display"
                style={{ fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: '-.04em', maxWidth: '14ch', lineHeight: 1.0, marginTop: 18 }}
              >
                {t('cta_h')}
              </h2>
              <p style={{ opacity: 0.7, marginTop: 18, maxWidth: '42ch', fontSize: 16 }}>{t('cta_sub')}</p>
              <button
                className="font-mono uppercase text-[12px] inline-flex items-center gap-2"
                style={{ background: 'var(--bg)', color: 'var(--ink)', padding: '14px 22px', marginTop: 32, letterSpacing: '.08em', borderRadius: 0 }}
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
