import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { ProductTile } from '@/components/product/ProductTile';
import { BRANDS } from '@/data/brands';
import { CATEGORIES } from '@/data/categories';

export function Shop() {
  const { lang, t } = useApp();
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

  return (
    <main className="page">
      <section className="container-x" style={{ paddingBlock: 'clamp(40px, 6vw, 80px) 40px' }}>
        <div className="eyebrow">{t('nav_shop')}</div>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 14, maxWidth: '18ch' }}>{t('shop_h')}</h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: 16, maxWidth: '50ch', fontSize: 18 }}>{t('shop_d')}</p>
      </section>

      <section className="container-x" style={{ paddingBottom: 32 }}>
        <div className="flex gap-4 items-center flex-wrap" style={{ marginBottom: 24 }}>
          <div
            className="flex items-center gap-2.5 border border-line-strong rounded-pill bg-bg-card"
            style={{ padding: '10px 18px', flex: '1 1 280px', maxWidth: 380 }}
          >
            <Icon.Search />
            <input
              placeholder={t('search_ph')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 border-0 bg-transparent outline-none text-[14px]"
            />
          </div>
          <div className="flex items-center gap-2.5 ms-auto">
            <span className="font-mono uppercase text-ink-mute text-[12px]" style={{ letterSpacing: '.08em' }}>{t('sort_by')}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-line-strong rounded-pill bg-bg-card text-[13px] outline-none"
              style={{ padding: '10px 14px' }}
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
              className={`cat-chip ${cat === c.id ? 'active' : ''}`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-9 md:gap-y-11">
            {filtered.map((b, i) => (
              <Reveal key={b.id} delay={Math.min(i * 50, 300)}>
                <ProductTile brand={b} onClick={() => navigate('/product/' + b.id)} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
