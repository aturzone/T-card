import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

interface LogoProps {
  size?: number;
  onClick?: () => void;
}

export function Logo({ size, onClick }: LogoProps) {
  const { lang } = useApp();
  const style: CSSProperties | undefined = size ? { fontSize: size } : undefined;
  return (
    <Link to="/" onClick={onClick} className="logo" style={style}>
      <span className="logo-mark italic">T</span>
      <span>{lang === 'fa' ? 'تی‌کارت' : 'T-Card'}</span>
    </Link>
  );
}
