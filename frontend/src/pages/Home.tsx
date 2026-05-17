import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Reveal } from '@/components/ui/Reveal';
import { GCard } from '@/components/product/GCard';
import { Icon } from '@/components/ui/Icon';
import { ProductTile } from '@/components/product/ProductTile';
import { useScrollProgress } from '@/hooks/useScrollProgress';
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

type Corner = 'tl' | 'tr' | 'bl' | 'br' | 'cl' | 'cr';
type StageSpec = {
  lockup: string;
  caption: { top: string; sub: string };
  textCorner: Corner;
};

const cornerStyle = (c: Corner): React.CSSProperties => {
  switch (c) {
    case 'tl': return { top: 88, left: 24, textAlign: 'start' };
    case 'tr': return { top: 88, right: 24, textAlign: 'end' };
    case 'bl': return { bottom: 56, left: 24, textAlign: 'start' };
    case 'br': return { bottom: 56, right: 24, textAlign: 'end' };
    case 'cl': return { top: '50%', left: 24, transform: 'translateY(-50%)', textAlign: 'start' };
    case 'cr': return { top: '50%', right: 24, transform: 'translateY(-50%)', textAlign: 'end' };
  }
};

export function Home() {
  const { lang, t } = useApp();
  const navigate = useNavigate();
  const featured = BRANDS.slice(0, 4);

  const heroRef = useRef<HTMLElement>(null);
  // Header is 72 px (see .header-inner in index.css). Pass it so the hook
  // doesn't ignore the first 72 px of scroll while the section is settling
  // into its sticky position.
  const scrollProgress = useScrollProgress(heroRef, 72);
  const time = useTehranClock(lang);

  const [show3D, setShow3D] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 768px)');
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShow3D(mqDesktop.matches);
    setReduced(mqReduced.matches);
    const onDesktop = (e: MediaQueryListEvent) => setShow3D(e.matches);
    const onReduced = (e: MediaQueryListEvent) => setReduced(e.matches);
    mqDesktop.addEventListener('change', onDesktop);
    mqReduced.addEventListener('change', onReduced);
    return () => {
      mqDesktop.removeEventListener('change', onDesktop);
      mqReduced.removeEventListener('change', onReduced);
    };
  }, []);

  // For driving lockup opacity off scroll. We sample on rAF and trigger a
  // cheap re-render at ~60fps; React's reconciler dedupes when nothing
  // visible changes.
  const [pTick, setPTick] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setPTick(scrollProgress());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress]);

  // Corner-snapping lockups — each stage lives in a different corner than its
  // neighbours, mirroring monolithstudio.com's frame-by-frame layout shifts.
  const STAGES: StageSpec[] = [
    {
      lockup: t('hero_lockup_home'),
      caption: { top: 'T-CARD STUDIO', sub: 'CONTEMPORARY GIFT CARDS — BASED IN TEHRAN' },
      textCorner: 'bl',
    },
    {
      lockup: lang === 'fa' ? 'هنر' : 'CRAFT',
      caption: { top: 'SIDENOTE', sub: 'Every card design hand-drawn by the studio. No stock art, no AI.' },
      textCorner: 'tl',
    },
    {
      lockup: lang === 'fa' ? 'برندها' : 'BRANDS',
      caption: { top: 'COLLECTION', sub: '80+ partners — Amazon, Steam, PlayStation, Netflix, and more.' },
      textCorner: 'cr',
    },
    {
      lockup: t('cta_buy_gift').replace(/[→↗←↑↓]/g, '').trim() || 'BUY',
      caption: { top: 'NEXT', sub: 'Scroll to the gallery, or jump straight to the shop.' },
      textCorner: 'br',
    },
  ];

  const stageCount = STAGES.length;
  // Effective progress for caption swap — drops to 0 if reduced motion (so
  // only stage 0 ever renders).
  const p = reduced ? 0 : pTick;
  const stageIdx = Math.min(stageCount - 1, Math.max(0, Math.floor(p * stageCount)));
  const stage = STAGES[stageIdx] ?? STAGES[0];

  // Hero scroll-jack region height: ~6 viewports of pinned scroll on desktop,
  // collapsed to a single viewport on mobile (no scrub, lockups stack).
  const heroHeight = show3D && !reduced ? '600vh' : '100vh';

  return (
    <main className="page">
      <section
        ref={heroRef}
        className="hero-scroll relative"
        style={{ height: heroHeight }}
      >
        <div
          className="hero-sticky sticky w-full overflow-hidden"
          style={{ top: 'var(--header-h, 72px)', height: 'calc(100vh - var(--header-h, 72px))' }}
        >
          {/* L0 — Full-bleed bust canvas */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            {show3D ? (
              <Suspense fallback={null}>
                <Statue3D scrollProgress={scrollProgress} />
              </Suspense>
            ) : null}
          </div>

          {/* L1 — Per-stage giant lockups, scroll-blended */}
          {STAGES.map((s, i) => {
            const d = p * stageCount - i;
            const op =
              d < -0.2 ? 0 :
              d < 0 ? (d + 0.2) / 0.2 :
              d < 0.8 ? 1 :
              d < 1 ? (1 - d) / 0.2 :
              0;
            const opFinal = reduced ? (i === 0 ? 1 : 0) : op;
            return (
              <h1
                key={i}
                data-stage={i}
                data-op={opFinal.toFixed(3)}
                data-p={p.toFixed(3)}
                className="hero-lockup font-display absolute pointer-events-none"
                style={{
                  top: '22%',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  fontSize: 'var(--fs-mega)',
                  fontWeight: 700,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.85,
                  color: '#ffffff',
                  opacity: opFinal,
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
            style={{ zIndex: 3 }}
          >
            <div
              className="absolute mono-corner"
              style={{ ...cornerStyle(stage.textCorner), maxWidth: '34ch', transition: 'top .35s var(--ease), bottom .35s var(--ease), left .35s var(--ease), right .35s var(--ease)' }}
            >
              {stage.caption.top}<br />
              <span style={{ opacity: 0.75 }}>{stage.caption.sub}</span>
            </div>

            <div className="absolute mono-corner" style={{ top: 24, left: 24 }}>
              {time} &mdash; {t('eyebrow_tehran')}
            </div>
            <div
              className="absolute mono-corner text-right"
              style={{ top: 24, right: 24 }}
            >
              {p < 0.95 ? 'KEEP SCROLLING ↓' : 'GALLERY BELOW ↓'}
            </div>
            <button
              className="absolute mono-corner hover:opacity-70"
              style={{
                bottom: 24,
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
              {STAGES.map((_, i) => (
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
