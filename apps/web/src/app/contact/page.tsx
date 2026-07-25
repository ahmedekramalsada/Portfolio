'use client';

import { useState } from 'react';

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
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold">Contact</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Have a project idea or just want to say hi?
      </p>

      {status === 'sent' ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
          <p className="font-medium text-green-700 dark:text-green-300">Message sent!</p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">I&apos;ll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input id="name" type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input id="email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
            <input id="subject" type="text" value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea id="message" required rows={6} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" disabled={status === 'sending'}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'error' && (
            <p className="text-sm text-red-500 text-center">Something went wrong. Try again.</p>
          )}
        </form>
      )}

      <div className="mt-12 rounded-lg border p-6">
        <h2 className="mb-4 font-semibold">Other ways to reach me</h2>
        <div className="space-y-2 text-sm">
          <p>Email: <a href="mailto:ahmedekramalsada@gmail.com" className="text-primary hover:underline">ahmedekramalsada@gmail.com</a></p>
          <p>GitHub: <a href="https://github.com/ahmedekram" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/ahmedekram</a></p>
          <p>LinkedIn: <a href="https://linkedin.com/in/ahmedekram" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">linkedin.com/in/ahmedekram</a></p>
        </div>
      </div>
    </div>
  );
}
