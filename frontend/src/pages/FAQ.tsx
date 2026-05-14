import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { FAQS } from '@/data/faqs';

export function FAQ() {
  const { lang } = useApp();
  const [open, setOpen] = useState<number>(0);

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <div className="text-center" style={{ marginBottom: 80 }}>
        <div className="eyebrow">{lang === 'fa' ? 'سوالات' : 'Help'}</div>
        <h1 className="display mx-auto" style={{ fontSize: 'var(--fs-h1)', marginTop: 16, maxWidth: '20ch' }}>
          {lang === 'fa' ? 'هر سوالی داری، اینجا جواب می‌گیری.' : 'Questions, answered.'}
        </h1>
      </div>
      <div className="flex flex-col mx-auto" style={{ maxWidth: 800 }}>
        {FAQS.map((f, i) => (
          <div
            key={i}
            className={`faq-item ${open === i ? 'open' : ''}`}
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            <div className="faq-q">
              <span style={{ textWrap: 'balance' as 'balance' }}>{f.q[lang]}</span>
              <span className="sign">+</span>
            </div>
            <div className="faq-a">{f.a[lang]}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
