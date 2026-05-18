import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/categories';
import type { Brand } from '@/data/types';
import { GCard } from './GCard';
import { Icon } from '@/components/ui/Icon';

interface ProductTileProps {
  brand: Brand;
  onClick?: () => void;
}

export function ProductTile({ brand, onClick }: ProductTileProps) {
  const { lang, fmtPrice } = useApp();
  const cat = CATEGORIES.find((c) => c.id === brand.cat);
  return (
    <div
      className="product-tile"
      onClick={onClick}
      style={{ borderBottom: '1px solid var(--line)', paddingBottom: 18 }}
    >
      <div style={{ aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <GCard brand={brand} amount={brand.amounts[0]} />
      </div>
      <div className="flex justify-between items-start gap-[10px] mt-3">
        <div className="min-w-0">
          <div className="product-name">{brand.name[lang] || brand.name.en}</div>
          <div className="product-cat font-mono uppercase" style={{ letterSpacing: '0.08em' }}>
            {cat ? cat[lang] : brand.cat}
            <span style={{ margin: '0 6px', opacity: 0.5 }}>·</span>
            <Icon.Star style={{ display: 'inline-block', verticalAlign: '-2px', color: 'var(--ink)' }} /> {brand.rating}
          </div>
        </div>
        <div className="product-price font-mono">
          {lang === 'fa' ? 'از ' : 'from '}
          {fmtPrice(brand.amounts[0])}
        </div>
      </div>
    </div>
  );
}
