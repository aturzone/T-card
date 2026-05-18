import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: number;
  onClick?: () => void;
}

export function Logo({ size, onClick }: LogoProps) {
  const style: CSSProperties | undefined = size ? { fontSize: size } : undefined;
  return (
    <Link to="/" onClick={onClick} className="logo" style={style}>
      <span>proop.shop</span>
    </Link>
  );
}
