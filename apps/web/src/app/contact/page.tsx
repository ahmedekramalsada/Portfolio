'use client';

import { useState } from 'react';

const OTHER_LINKS = [
  { label: 'Email', value: 'ahmedekramalsada@gmail.com', href: 'mailto:ahmedekramalsada@gmail.com' },
  { label: 'GitHub', value: 'github.com/ahmedekramalsada', href: 'https://github.com/ahmedekramalsada' },
  { label: 'LinkedIn', value: 'linkedin.com/in/ahmedekramalsada', href: 'https://linkedin.com/in/ahmedekramalsada' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('http://localhost:4000/api/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="page">
      <header className="mb-12">
        <span className="label">Contact</span>
        <h1 className="h1 mt-5 max-w-[24ch]">Send me the problem, not a job title</h1>
        <p className="lede">
          Have a project idea, a platform that keeps falling over, or just want to say hi? Write below and I&apos;ll answer.
        </p>
      </header>

      {status === 'sent' ? (
        <div className="panel p-8 text-center">
          <span className="status s-ok">Message sent</span>
          <p className="mt-5 text-[16px]">Thank you — your message reached me.</p>
          <p className="mt-2 text-[14.5px] text-muted-foreground">I&apos;ll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label-field">Name</label>
              <input id="name" type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" />
            </div>
            <div>
              <label htmlFor="email" className="label-field">Email</label>
              <input id="email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="label-field">Subject</label>
            <input id="subject" type="text" value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })} className="field" />
          </div>

          <div>
            <label htmlFor="message" className="label-field">Message</label>
            <textarea id="message" required rows={7} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} className="field" />
          </div>

          <button type="submit" disabled={status === 'sending'} className="btn-primary self-start disabled:opacity-50">
            {status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden>→</span>
          </button>

          {status === 'error' && (
            <p className="text-[14px] text-[#e08b7a]">Something went wrong. Try again, or email me directly.</p>
          )}
        </form>
      )}

      <section className="panel mt-16 divide-y divide-line">
        {OTHER_LINKS.map((link) => (
          <div key={link.label} className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
            <span className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">{link.label}</span>
            <a
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-[14.5px] text-muted-foreground transition hover:text-warm"
            >
              {link.value}
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}
