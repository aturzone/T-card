import { useApp } from '@/context/AppContext';
import type { Brand, Lang } from '@/data/types';
import { fmtPrice } from '@/data/format';
import { CardPattern } from './CardPattern';
import { BrandMark } from './BrandMark';

interface GCardProps {
  brand: Brand;
  amount?: number;
  lang?: Lang;
  mini?: boolean;
}

export function GCard({ brand, amount, lang: langProp, mini }: GCardProps) {
  const { lang: langCtx } = useApp();
  const lang = langProp || langCtx || 'en';
  const { palette, name } = brand;
  const bg = `linear-gradient(135deg, ${palette.a} 0%, ${palette.b} 100%)`;

  return (
    <div className="gcard" style={{ background: bg }}>
      <div className="gcard-pattern">
        <CardPattern brandId={brand.id} />
      </div>
      <div className="gcard-inner">
        <div className="gcard-brand">
          <BrandMark brand={brand} size={mini ? 22 : 36} />
          {!mini && (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: 16 }}>{name[lang] || name.en}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, opacity: 0.7, marginTop: 4, letterSpacing: '.14em' }}>GIFT CARD</span>
            </div>
          )}
        </div>
        {!mini && (
          <div className="gcard-bottom">
            <div
              className="gcard-chip"
              style={{ background: `linear-gradient(135deg, ${palette.accent}, rgba(255,255,255,.4))` }}
            />
            {amount !== undefined && (
              <div className="gcard-amount" style={{ color: palette.accent }}>
                <span key={amount} className="amount-anim">{fmtPrice(amount, lang)}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="gcard-shine" />
    </div>
  );
}
