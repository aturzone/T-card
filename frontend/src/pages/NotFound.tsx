import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export function NotFound() {
  const { lang } = useApp();
  const navigate = useNavigate();
  return (
    <main className="page container-x text-center" style={{ paddingBlock: 140 }}>
      <div className="display italic" style={{ fontSize: 'clamp(80px, 16vw, 180px)', color: 'var(--accent)', lineHeight: 1 }}>404</div>
      <h1 className="display" style={{ fontSize: 'var(--fs-h2)', marginTop: 20 }}>
        {lang === 'fa' ? 'این صفحه پیدا نشد' : 'Page not found'}
      </h1>
      <p className="text-ink-soft mx-auto" style={{ marginTop: 12, maxWidth: '40ch' }}>
        {lang === 'fa' ? 'صفحه‌ای که دنبالش بودید موجود نیست. بیایید به جایی برویم که هست.' : "The page you were looking for doesn't exist. Let's get you back."}
      </p>
      <button className="btn btn-primary btn-lg" style={{ marginTop: 30 }} onClick={() => navigate('/')}>
        {lang === 'fa' ? 'بازگشت به خانه' : 'Back to home'}
      </button>
    </main>
  );
}
