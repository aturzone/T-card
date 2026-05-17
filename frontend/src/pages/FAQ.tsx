import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { FAQS } from '@/data/faqs';

export function FAQ() {
  const { lang, fmtNumber } = useApp();
  const [open, setOpen] = useState<number>(0);

  // TODO(i18n): replace with t('hero_lockup_faq') once Agent F adds the key.
  const lockup = 'QUESTIONS';
  const total = FAQS.length;

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <section style={{ marginBottom: 80 }}>
        <div
          className="font-mono uppercase text-ink-mute"
          style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 24 }}
        >
          03 / 12 &mdash; {lang === 'fa' ? 'سوالات' : 'FAQ'} &mdash; {fmtNumber(total)} {lang === 'fa' ? 'پرسش' : 'ENTRIES'}
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: 'var(--fs-hero)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          {lockup}
        </h1>
        <p
          className="text-ink-soft"
          style={{ fontSize: 18, marginTop: 24, maxWidth: '50ch' }}
        >
          {lang === 'fa' ? 'هر سوالی داری، اینجا جواب می‌گیری.' : 'Everything we get asked, answered in plain language.'}
        </p>
      </section>

      <div className="border-t border-line">
        {FAQS.map((f, i) => (
          <div
            key={i}
            className={`faq-item ${open === i ? 'open' : ''}`}
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            <div className="faq-q">
              <span className="font-mono text-ink-mute" style={{ fontSize: 12, letterSpacing: '0.08em', marginInlineEnd: 16 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ flex: 1, textWrap: 'balance' as 'balance' }}>{f.q[lang]}</span>
              <span className="sign">+</span>
            </div>
            <div className="faq-a">{f.a[lang]}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
