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

// ===================================================================
// Hero choreography model
// ===================================================================
//
// monolithstudio.com pattern (derived from frame-by-frame captures):
//   - ONE sticky bust + canvas
//   - 1–2 GIANT lockups that appear briefly (start + end of scroll-jack)
//   - Several CAPTION BLOCKS that slide IN/OUT as scroll passes
//
// Each block has 4 scroll markers:
//   [a, b, c, d] = enter_start, enter_end, exit_start, exit_end
// Between [a..b] the block fades + slides into position.
// Between [b..c] it sits stable.
// Between [c..d] it fades + slides out (upward).
// Outside the range it's invisible.

type BlockMotion = { op: number; y: number; wipe: number };

function blockMotion(p: number, [a, b, c, d]: [number, number, number, number]): BlockMotion {
  if (p < a) return { op: 0, y: 60, wipe: 100 };
  if (p < b) {
    const t = (p - a) / Math.max(1e-6, b - a);
    const e = t * t * (3 - 2 * t); // smoothstep
    return { op: e, y: 60 * (1 - e), wipe: (1 - e) * 100 };
  }
  if (p < c) return { op: 1, y: 0, wipe: 0 };
  if (p < d) {
    const t = (p - c) / Math.max(1e-6, d - c);
    const e = t * t * (3 - 2 * t);
    return { op: 1 - e, y: -60 * e, wipe: 0 };
  }
  return { op: 0, y: -60, wipe: 0 };
}

type BlockPos = 'tl' | 'tr' | 'bl' | 'br' | 'ml' | 'mr';
type CaptionBlock = {
  id: string;
  pos: BlockPos;
  kind: 'mono' | 'card' | 'paragraph';
  eyebrow: { en: string; fa: string };
  body: { en: string; fa: string };
  range: [number, number, number, number];
  wipe: 'ltr' | 'rtl';
};

type Lockup = {
  id: string;
  text: { en: string; fa: string };
  variant: 'sash' | 'stack-left';
  range: [number, number, number, number];
};

function blockBasePos(pos: BlockPos): React.CSSProperties {
  // Use PHYSICAL textAlign (left/right) instead of logical (start/end) so
  // RTL Persian doesn't invert the read direction for fixed-side blocks.
  switch (pos) {
    case 'tl': return { top: 16, left: 24, textAlign: 'left' };
    case 'tr': return { top: 16, right: 24, textAlign: 'right' };
    case 'bl': return { bottom: 56, left: 24, textAlign: 'left' };
    case 'br': return { bottom: 56, right: 24, textAlign: 'right' };
    case 'ml': return { top: '38%', left: 24, textAlign: 'left' };
    case 'mr': return { top: '38%', right: 24, textAlign: 'right' };
  }
}

function wipeClip(wipe: 'ltr' | 'rtl', amount: number): string {
  if (wipe === 'ltr') return `inset(0 ${amount}% 0 0)`;
  return `inset(0 0 0 ${amount}%)`;
}

export function Home() {
  const { lang, t } = useApp();
  const navigate = useNavigate();
  const featured = BRANDS.slice(0, 4);

  const heroRef = useRef<HTMLElement>(null);
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

  // Pause everything tied to the hero once it scrolls off-screen. Without
  // this, the bust Canvas keeps drawing at 60 fps and the pTick rAF keeps
  // calling setState — both invisible work that makes the sections below
  // feel laggy or even kill the tab on weaker GPUs.
  const [heroInView, setHeroInView] = useState(true);
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setHeroInView(e.isIntersecting);
      },
      // Margin keeps the hero "active" until it's a full viewport below the
      // fold, so quick back-scrolls don't catch a paused Canvas.
      { rootMargin: '50% 0px 50% 0px', threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [pTick, setPTick] = useState(0);
  useEffect(() => {
    if (!heroInView) return; // freeze caption motion when hero is off-screen
    let raf = 0;
    const tick = () => {
      setPTick(scrollProgress());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress, heroInView]);

  const p = reduced ? 0 : pTick;

  // Caption blocks scroll past the sticky bust. Ranges are sequenced so each
  // block enters AFTER the previous exits — sidenote-brands now finishes
  // before SHOP NOW begins to enter.
  const BLOCKS: CaptionBlock[] = [
    {
      id: 'tagline',
      pos: 'bl',
      kind: 'mono',
      eyebrow: { en: 'T-CARD STUDIO', fa: 'استودیو تی‌کارت' },
      body: {
        en: 'CONTEMPORARY GIFT CARDS — BASED IN TEHRAN',
        fa: 'کارت‌های هدیه معاصر — تهران',
      },
      range: [0, 0, 0.08, 0.13],
      wipe: 'ltr',
    },
    {
      id: 'about',
      pos: 'ml',
      kind: 'paragraph',
      eyebrow: { en: 'ABOUT', fa: 'درباره ما' },
      body: {
        en: 'T-Card brings 80+ global brands’ gift cards to Iran with hand-drawn covers and 90-second delivery.',
        fa: 'تی‌کارت بیش از ۸۰ برند جهانی را با کارت‌های دست‌ساز و تحویل ۹۰ ثانیه‌ای به ایران می‌آورد.',
      },
      range: [0.10, 0.16, 0.24, 0.30],
      wipe: 'ltr',
    },
    {
      id: 'sidenote-craft',
      pos: 'mr',
      kind: 'card',
      eyebrow: { en: 'SIDENOTE', fa: 'یادداشت' },
      body: {
        en: 'Every card cover is hand-drawn by the studio. No stock art, no AI.',
        fa: 'طرح روی هر کارت دست‌ساز استودیو است. بدون عکس آماده، بدون هوش مصنوعی.',
      },
      range: [0.26, 0.32, 0.40, 0.46],
      wipe: 'rtl',
    },
    {
      id: 'vision',
      pos: 'mr',
      kind: 'paragraph',
      eyebrow: { en: 'OUR VISION', fa: 'چشم‌انداز' },
      body: {
        en: 'Make the friction of buying a foreign gift card disappear — from search to send in under two minutes.',
        fa: 'حذف اصطکاک خرید کارت‌های هدیه خارجی — از جستجو تا ارسال در کمتر از دو دقیقه.',
      },
      range: [0.42, 0.48, 0.56, 0.62],
      wipe: 'rtl',
    },
    {
      id: 'sidenote-brands',
      pos: 'ml',
      kind: 'card',
      eyebrow: { en: 'SIDENOTE', fa: 'یادداشت' },
      body: {
        en: 'Brands you know — Amazon, Steam, PlayStation, Netflix, and 80+ more.',
        fa: 'برندهای آشنا — آمازون، استیم، پلی‌استیشن، نتفلیکس و بیش از ۸۰ برند دیگر.',
      },
      // Closes at 0.74 so SHOP-NOW lockup can take over the screen clean.
      range: [0.58, 0.64, 0.72, 0.78],
      wipe: 'ltr',
    },
  ];

  // Two giant lockups bookend the hero scroll-jack. SHOP-NOW now starts
  // AFTER sidenote-brands has fully exited (0.78 vs 0.66), so there's a
  // clean handoff to the closing lockup.
  const LOCKUPS: Lockup[] = [
    {
      id: 'tcard',
      text: { en: 'TCARD', fa: 'تی‌کارت' },
      variant: 'sash',
      range: [0, 0, 0.08, 0.13],
    },
    {
      id: 'shop',
      text: { en: 'SHOP\nNOW', fa: 'خرید\nکارت' },
      variant: 'stack-left',
      range: [0.80, 0.86, 0.98, 1.0],
    },
  ];

  // Scroll-jack length. Tuned to give each block ~16–18% of scroll, which
  // matches the cadence of the monolith reference.
  const heroHeight = show3D && !reduced ? '700vh' : '100vh';

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
                <Statue3D scrollProgress={scrollProgress} active={heroInView} />
              </Suspense>
            ) : null}
          </div>

          {/* L1 — Giant scroll-bound lockups */}
          {LOCKUPS.map((lk) => {
            const m = reduced && lk.id !== 'tcard' ? { op: 0, y: 0, wipe: 0 } :
                      reduced ? { op: 1, y: 0, wipe: 0 } : blockMotion(p, lk.range);
            const text = lk.text[lang];
            // Persian display fonts ship wider glyphs — cap a bit smaller so
            // the wordmark fits inside the viewport at every breakpoint.
            const isFa = lang === 'fa';
            if (lk.variant === 'sash') {
              return (
                <h1
                  key={lk.id}
                  data-id={lk.id}
                  className="font-display absolute pointer-events-none"
                  style={{
                    // Persian glyphs carry dots and diacritics above the
                    // baseline. The sticky parent clips overflow, so we
                    // push the wordmark down + give it loose line-height
                    // on FA so the marks don't get sliced off.
                    top: isFa ? '20%' : '12%',
                    left: '50%',
                    transform: `translate3d(-50%, ${m.y * 0.5}px, 0)`,
                    fontSize: isFa
                      ? 'clamp(64px, 12vw, 200px)'
                      : 'clamp(72px, 16vw, 260px)',
                    fontWeight: 700,
                    letterSpacing: isFa ? '0' : '-0.04em',
                    lineHeight: isFa ? 1.25 : 0.85,
                    color: '#ffffff',
                    opacity: m.op,
                    zIndex: 2,
                    mixBlendMode: 'difference',
                    whiteSpace: 'nowrap',
                    margin: 0,
                    padding: isFa ? '0.2em 0 0' : 0,
                    clipPath: wipeClip('ltr', m.wipe * 0.5),
                  }}
                >
                  {text}
                </h1>
              );
            }
            // stack-left: two-line stack. FA needs looser line-height +
            // top inset for the dots/diacritics; LTR keeps the tight 0.9.
            return (
              <h2
                key={lk.id}
                data-id={lk.id}
                className="font-display absolute pointer-events-none"
                style={{
                  top: isFa ? '20%' : '15%',
                  left: 32,
                  transform: `translate3d(0, ${m.y * 0.5}px, 0)`,
                  fontSize: isFa
                    ? 'clamp(52px, 9vw, 130px)'
                    : 'clamp(64px, 11vw, 160px)',
                  fontWeight: 700,
                  letterSpacing: isFa ? '0' : '-0.04em',
                  lineHeight: isFa ? 1.25 : 0.9,
                  color: '#ffffff',
                  opacity: m.op,
                  zIndex: 2,
                  mixBlendMode: 'difference',
                  whiteSpace: 'pre',
                  margin: 0,
                  padding: isFa ? '0.2em 0 0' : 0,
                  clipPath: wipeClip('ltr', m.wipe),
                }}
              >
                {text}
              </h2>
            );
          })}

          {/* L2 — Caption blocks with scroll-bound slide + wipe entrance */}
          <div className="container-x relative h-full" style={{ zIndex: 3 }}>
            {BLOCKS.map((b) => {
              const m = reduced && b.id !== 'tagline' ? { op: 0, y: 0, wipe: 0 } :
                        reduced ? { op: 1, y: 0, wipe: 0 } : blockMotion(p, b.range);
              const eb = b.eyebrow[lang];
              const body = b.body[lang];
              const base = blockBasePos(b.pos);
              const maxW = b.kind === 'paragraph' ? '38ch' : b.kind === 'card' ? '36ch' : '34ch';

              if (b.kind === 'card') {
                return (
                  <div
                    key={b.id}
                    data-id={b.id}
                    className="absolute pointer-events-none"
                    style={{
                      ...base,
                      maxWidth: maxW,
                      transform: `translate3d(0, ${m.y}px, 0)`,
                      opacity: m.op,
                      clipPath: wipeClip(b.wipe, m.wipe),
                      transition: 'none',
                    }}
                  >
                    <div
                      style={{
                        background: 'var(--ink)',
                        color: 'var(--bg)',
                        padding: '14px 20px 18px',
                        borderRadius: 0,
                        minWidth: 280,
                      }}
                    >
                      <div className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '.08em', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.18)', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{eb}</span>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bg)' }} />
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.45, margin: 0 }}>
                        {body}
                      </p>
                    </div>
                  </div>
                );
              }
              if (b.kind === 'paragraph') {
                return (
                  <div
                    key={b.id}
                    data-id={b.id}
                    className="absolute pointer-events-none"
                    style={{
                      ...base,
                      maxWidth: maxW,
                      transform: `translate3d(0, ${m.y}px, 0)`,
                      opacity: m.op,
                      clipPath: wipeClip(b.wipe, m.wipe),
                    }}
                  >
                    <div className="font-mono uppercase text-ink-mute" style={{ fontSize: 11, letterSpacing: '.08em', marginBottom: 14 }}>
                      {eb}
                    </div>
                    <p className="font-display" style={{ fontSize: 'clamp(20px, 1.8vw, 28px)', lineHeight: 1.25, color: 'var(--ink)', margin: 0, letterSpacing: '-.01em' }}>
                      {body}
                    </p>
                  </div>
                );
              }
              // mono
              return (
                <div
                  key={b.id}
                  data-id={b.id}
                  className="absolute mono-corner pointer-events-none"
                  style={{
                    ...base,
                    maxWidth: maxW,
                    transform: `translate3d(0, ${m.y}px, 0)`,
                    opacity: m.op,
                    clipPath: wipeClip(b.wipe, m.wipe),
                  }}
                >
                  {eb}<br />
                  <span style={{ opacity: 0.75 }}>{body}</span>
                </div>
              );
            })}

            {/* Persistent UI — clock, scroll hint, CTA, progress dots */}
            <div className="absolute mono-corner" style={{ top: 24, left: 24 }}>
              {time} &mdash; {t('eyebrow_tehran')}
            </div>
            <div
              className="absolute mono-corner text-right"
              style={{ top: 24, right: 24 }}
            >
              {p < 0.95 ? (lang === 'fa' ? 'به اسکرول ادامه دهید ↓' : 'KEEP SCROLLING ↓') : (lang === 'fa' ? 'گالری در ادامه ↓' : 'GALLERY BELOW ↓')}
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

            {/* Scroll progress bar — single line growing left-to-right.
                More minimal than the dots, matches the ref's mono aesthetic. */}
            <div
              className="absolute"
              style={{
                bottom: 28,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 160,
                height: 1,
                background: 'rgba(1,1,1,.18)',
                zIndex: 4,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.max(0, p * 100))}%`,
                  background: 'var(--ink)',
                  transition: 'none',
                }}
              />
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
