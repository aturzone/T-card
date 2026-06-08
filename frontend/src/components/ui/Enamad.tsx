import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { COMPANY } from '@/data/company';

/**
 * eNamad — «نماد اعتماد الکترونیکی», Iran's official e-commerce trust seal.
 *
 * Renders the official badge straight from the eNamad panel
 * (COMPANY.enamad.id / .code). Two rules from eNamad's own guidance that are
 * easy to get wrong and silently break the seal:
 *
 *   1. The logo MUST be loaded from trustseal.enamad.ir — it can't be
 *      self-hosted, because the seal is verified live against the registered
 *      domain. As a result it only renders on that domain; on localhost / a
 *      not-yet-approved domain the image won't load.
 *   2. Do NOT add rel="noopener noreferrer" to the link. eNamad explicitly
 *      warns it stops the seal from rendering (WordPress et al. add it to
 *      external links automatically — that's the usual "logo won't show" bug).
 *      We keep referrerPolicy="origin" (which they require) instead; modern
 *      browsers already imply noopener for target="_blank", so dropping the rel
 *      is safe against tab-nabbing.
 *
 * When the official image can't load (offline, dev preview, or before the
 * domain is approved) we fall back to a self-contained SVG stand-in so the
 * footer never shows a broken image.
 */
export function Enamad({ className = '' }: { className?: string }) {
  const { lang } = useApp();
  const [imgFailed, setImgFailed] = useState(false);
  const label =
    lang === 'fa'
      ? 'نماد اعتماد الکترونیکی'
      : 'eNamad — Iranian e-commerce trust seal';

  const { id, code } = COMPANY.enamad;
  const registered = Boolean(id && code);
  const href = registered
    ? `https://trustseal.enamad.ir/?id=${id}&Code=${code}`
    : 'https://enamad.ir/';
  const showOfficial = registered && !imgFailed;

  return (
    <a
      href={href}
      target="_blank"
      referrerPolicy="origin"
      aria-label={label}
      title={label}
      className={`enamad-badge ${showOfficial ? 'enamad-badge--official' : ''} ${className}`
        .replace(/\s+/g, ' ')
        .trim()}
    >
      {showOfficial ? (
        <img
          className="enamad-img"
          referrerPolicy="origin"
          src={`https://trustseal.enamad.ir/logo.aspx?id=${id}&Code=${code}`}
          alt={label}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <>
          <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
            <defs>
              <linearGradient id="enamad-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2a8af0" />
                <stop offset="1" stopColor="#0a3d7a" />
              </linearGradient>
            </defs>
            <rect width="48" height="48" rx="11" fill="url(#enamad-grad)" />
            {/* shield */}
            <path
              d="M24 8.5 L36 12.7 V23.5 C36 31.6 30.6 36.4 24 39 C17.4 36.4 12 31.6 12 23.5 V12.7 Z"
              fill="#ffffff"
              fillOpacity="0.14"
              stroke="#ffffff"
              strokeOpacity="0.85"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* check */}
            <path
              d="M17.5 24 L22 28.5 L31 18.5"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="enamad-text">
            <strong>نماد اعتماد</strong>
            <span className="enamad-sub">الکترونیکی</span>
          </span>
        </>
      )}
    </a>
  );
}
