import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export function NotFound() {
  const { lang } = useApp();
  const navigate = useNavigate();
  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <div className="font-mono uppercase text-ink-mute text-[11px]" style={{ letterSpacing: '.08em' }}>
        {lang === 'fa' ? 'خطا — ۴۰۴' : 'ERROR — 404'}
      </div>
      <h1
        className="display"
        style={{
          fontSize: 'var(--fs-hero)',
          fontWeight: 700,
          letterSpacing: '-.04em',
          lineHeight: 0.9,
          color: 'var(--ink)',
          marginTop: 18,
        }}
      >
        404
      </h1>
      <p
        className="font-mono uppercase text-ink-soft text-[13px]"
        style={{ marginTop: 24, letterSpacing: '.06em', maxWidth: '50ch' }}
      >
        {lang === 'fa'
          ? 'این صفحه پیدا نشد. صفحه‌ای که دنبالش بودید موجود نیست.'
          : 'Page not found. The page you were looking for doesn’t exist.'}
      </p>
      <button
        className="font-mono uppercase text-[12px]"
        style={{
          marginTop: 32,
          letterSpacing: '.08em',
          color: 'var(--ink)',
          background: 'transparent',
          borderBottom: '1px solid var(--ink)',
          paddingBottom: 4,
        }}
        onClick={() => navigate('/')}
      >
        ← {lang === 'fa' ? 'بازگشت' : 'BACK'}
      </button>
    </main>
  );
}
