import type { CSSProperties } from 'react';

interface TCMarkProps {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export function TCMark({ size = 32, className, style, title }: TCMarkProps) {
  const dim = typeof size === 'number' ? `${size}px` : size;
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: dim, height: dim, display: 'block', color: 'currentColor', ...style }}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d="M 8 8 H 56 V 16 H 36 V 32 H 28 V 16 H 8 Z" fill="currentColor" />
      <path
        d="M 40 38 A 11 11 0 1 0 40 58"
        stroke="currentColor"
        strokeWidth="7"
        fill="none"
      />
    </svg>
  );
}
