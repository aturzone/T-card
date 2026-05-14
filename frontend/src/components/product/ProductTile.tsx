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
    <div className="product-tile" onClick={onClick}>
      <GCard brand={brand} amount={brand.amounts[0]} />
      <div className="flex justify-between items-start gap-[10px]">
        <div>
          <div className="product-name">{brand.name[lang] || brand.name.en}</div>
          <div className="product-cat">
            {cat ? cat[lang] : brand.cat}
            <span style={{ margin: '0 6px', opacity: 0.5 }}>·</span>
            <Icon.Star style={{ display: 'inline-block', verticalAlign: '-2px', color: 'var(--gold)' }} /> {brand.rating}
          </div>
        </div>
        <div className="product-price">
          {lang === 'fa' ? 'از ' : 'from '}
          {fmtPrice(brand.amounts[0])}
        </div>
      </div>
    </div>
  );
}
