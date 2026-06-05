import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { TCMark } from '@/components/brand/TCMark';

interface LogoProps {
  size?: number | string;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Logo({ size = 28, onClick, style }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="logo"
      aria-label="T-Card home"
      style={{ color: 'var(--ink)', ...style }}
    >
      <TCMark size={size} title="T-Card" />
    </Link>
  );
}
