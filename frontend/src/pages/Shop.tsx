import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { ProductTile } from '@/components/product/ProductTile';
import { BRANDS } from '@/data/brands';
import { CATEGORIES } from '@/data/categories';

export function Shop() {
  const { lang, t, fmtNumber } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialCat = params.get('cat') || 'all';
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState<'pop' | 'price-asc' | 'price-desc' | 'rating'>('pop');
  const [q, setQ] = useState('');

  useEffect(() => {
    setCat(params.get('cat') || 'all');
  }, [params]);

  const filtered = useMemo(() => {
    let list = BRANDS.slice();
    if (cat !== 'all') list = list.filter((b) => b.cat === cat);
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(
        (b) => b.name.en.toLowerCase().includes(qq) || b.name.fa.includes(q),
      );
    }
    if (sort === 'price-asc') list.sort((a, b) => a.amounts[0] - b.amounts[0]);
    else if (sort === 'price-desc') list.sort((a, b) => b.amounts[0] - a.amounts[0]);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [cat, sort, q]);

  // TODO(i18n): replace with t('hero_lockup_shop') once Agent F adds the key.
  const lockup = 'BRANDS';
  const total = BRANDS.length;

  return (
    <main className="page">
      <section
        className="container-x"
        style={{ paddingBlock: 'clamp(40px, 6vw, 80px) 40px' }}
      >
        <div
          className="font-mono uppercase text-ink-mute"
          style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 24 }}
        >
          01 / 12 &mdash; {t('nav_shop').toUpperCase()} &mdash; {fmtNumber(total)} {lang === 'fa' ? 'برند' : 'TOTAL'}
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
        <p
          style={{
            color: 'var(--ink-soft)',
            marginTop: 24,
            maxWidth: '50ch',
            fontSize: 18,
          }}
        >
          {t('shop_d')}
        </p>
      </section>

      <section className="container-x" style={{ paddingBottom: 32 }}>
        <div
          className="flex gap-4 items-center flex-wrap border-t border-b border-line"
          style={{ marginBottom: 32, paddingBlock: 16 }}
        >
          <div
            className="flex items-center gap-2.5"
            style={{ flex: '1 1 280px', maxWidth: 380 }}
          >
            <Icon.Search />
            <input
              placeholder={t('search_ph')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 border-0 bg-transparent outline-none text-[14px] font-mono"
            />
          </div>
          <div className="flex items-center gap-2.5 ms-auto">
            <span
              className="font-mono uppercase text-ink-mute text-[11px]"
              style={{ letterSpacing: '0.08em' }}
            >
              {t('sort_by')}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border-0 border-b border-line bg-transparent font-mono uppercase text-[12px] outline-none focus:border-ink"
              style={{ padding: '6px 4px', letterSpacing: '0.06em' }}
            >
              <option value="pop">{t('sort_pop')}</option>
              <option value="price-asc">{t('sort_price_a')}</option>
              <option value="price-desc">{t('sort_price_d')}</option>
              <option value="rating">{t('sort_rating')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5" style={{ marginBottom: 48 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`cat-chip rounded-pill ${cat === c.id ? 'active' : ''}`}
              onClick={() => setCat(c.id)}
            >
              {c[lang]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-ink-mute" style={{ padding: 100 }}>
            <p className="font-display" style={{ fontSize: 28 }}>{t('no_results')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-line">
            {filtered.map((b, i) => (
              <Reveal
                key={b.id}
                delay={Math.min(i * 50, 300)}
              >
                <div
                  className="border-r border-b border-line h-full"
                  style={{ padding: 'clamp(12px, 2vw, 20px)' }}
                >
                  <ProductTile brand={b} onClick={() => navigate('/product/' + b.id)} />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
