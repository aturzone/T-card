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

  return (
    <main className="page container-x" style={{ paddingBlock: 'clamp(60px, 9vw, 140px)' }}>
      <div className="grid grid-cols-1 md:[grid-template-columns:1fr_1.2fr] gap-10 md:gap-[80px] items-start">
        <div>
          <div className="eyebrow">{lang === 'fa' ? 'تماس' : 'Contact'}</div>
          <h1 className="display" style={{ fontSize: 'var(--fs-h1)', marginTop: 16, lineHeight: 1.05 }}>{t('contact_h')}</h1>
          <p className="text-ink-soft" style={{ marginTop: 20, fontSize: 17, maxWidth: '38ch' }}>{t('contact_d')}</p>

          <div className="flex flex-col gap-6" style={{ marginTop: 50 }}>
            {info.map((x, i) => (
              <div key={i}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>{x.lbl}</div>
                <div className="font-display" style={{ fontSize: 22 }}>{x.val}</div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="flex flex-col gap-[18px] bg-bg-card border border-line"
          style={{ padding: 'clamp(28px, 4vw, 48px)', borderRadius: 'var(--radius-lg)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="field">
              <label>{t('f_name')}</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>{t('f_email')}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label>{lang === 'fa' ? 'موضوع' : 'Subject'}</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <div className="field">
            <label>{lang === 'fa' ? 'پیام شما' : 'Message'}</label>
            <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
            {sent ? (<><Icon.Check /> {lang === 'fa' ? 'ارسال شد' : 'Sent'}</>) : (<>{t('contact_send')} <Icon.Arrow /></>)}
          </button>
        </form>
      </div>
    </main>
  );
}
