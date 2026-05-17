import { useState, type FormEvent } from 'react';
import { useApp } from '@/context/AppContext';
import { Icon } from '@/components/ui/Icon';

export function Contact() {
  const { lang, t } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const info = [
    { lbl: lang === 'fa' ? 'ایمیل' : 'Email', val: 'hello@t-card.co' },
    { lbl: lang === 'fa' ? 'تلفن' : 'Phone', val: '+1 (555) 240-9134' },
    { lbl: lang === 'fa' ? 'دفتر' : 'Office', val: lang === 'fa' ? 'تهران، خیابان ولیعصر' : '21 Rivington St, NY 10002' },
  ];

  // TODO(i18n): replace with t('hero_lockup_contact') once Agent F adds the key.
  const lockup = 'CONTACT';

  const inputCls =
    'w-full border-0 border-b border-line focus:border-ink rounded-none bg-transparent font-mono text-[14px] outline-none transition-colors';
  const inputStyle: React.CSSProperties = {
    padding: '12px 0',
  };

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <section style={{ marginBottom: 80 }}>
        <div
          className="font-mono uppercase text-ink-mute"
          style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 24 }}
        >
          04 / 12 &mdash; {lang === 'fa' ? 'تماس' : 'CONTACT'} &mdash; {lang === 'fa' ? 'تهران' : 'TEHRAN'}
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
          style={{ fontSize: 18, marginTop: 24, maxWidth: '38ch' }}
        >
          {t('contact_d')}
        </p>
      </section>

      <div className="grid grid-cols-1 md:[grid-template-columns:1fr_1.2fr] gap-10 md:gap-[80px] items-start border-t border-line" style={{ paddingTop: 48 }}>
        <div>
          <h2
            className="font-display"
            style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.05 }}
          >
            {t('contact_h')}
          </h2>

          <div className="flex flex-col" style={{ marginTop: 48 }}>
            {info.map((x, i) => (
              <div
                key={i}
                className="border-t border-line"
                style={{ paddingBlock: 20 }}
              >
                <div
                  className="font-mono uppercase text-ink-mute"
                  style={{ fontSize: 11, letterSpacing: '0.08em', marginBottom: 6 }}
                >
                  {x.lbl}
                </div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {x.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span
                className="font-mono uppercase text-ink-mute"
                style={{ fontSize: 11, letterSpacing: '0.08em' }}
              >
                {t('f_name')}
              </span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className={inputCls}
                style={inputStyle}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span
                className="font-mono uppercase text-ink-mute"
                style={{ fontSize: 11, letterSpacing: '0.08em' }}
              >
                {t('f_email')}
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className={inputCls}
                style={inputStyle}
              />
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <span
              className="font-mono uppercase text-ink-mute"
              style={{ fontSize: 11, letterSpacing: '0.08em' }}
            >
              {lang === 'fa' ? 'موضوع' : 'Subject'}
            </span>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className={inputCls}
              style={inputStyle}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span
              className="font-mono uppercase text-ink-mute"
              style={{ fontSize: 11, letterSpacing: '0.08em' }}
            >
              {lang === 'fa' ? 'پیام شما' : 'Message'}
            </span>
            <textarea
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className={`${inputCls} resize-y`}
              style={{ ...inputStyle, minHeight: 140 }}
            />
          </label>
          <button
            type="submit"
            className="font-mono uppercase inline-flex items-center justify-center gap-2 self-start rounded-none"
            style={{
              background: 'var(--ink)',
              color: 'var(--bg)',
              padding: '16px 28px',
              fontSize: 12,
              letterSpacing: '0.1em',
              marginTop: 8,
              border: 0,
              cursor: 'pointer',
            }}
          >
            {sent ? (
              <>
                <Icon.Check /> {lang === 'fa' ? 'ارسال شد' : 'SENT'}
              </>
            ) : (
              <>
                {t('contact_send')} <Icon.Arrow />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
