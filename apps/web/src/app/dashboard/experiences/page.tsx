'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

const emptyForm = { company: '', position: '', startDate: '', endDate: '', description: '' };

function dateInput(value: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setExperiences(await api.get<Experience[]>('/experiences'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load experience');
    }
  };

  useEffect(() => { void load(); }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = { ...form, endDate: form.endDate || null };
      if (editingId) await api.patch(`/experiences/${editingId}`, body);
      else await api.post('/experiences', body);
      reset();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save experience');
    } finally {
      setSaving(false);
    }
  };

  const edit = (experience: Experience) => {
    setEditingId(experience.id);
    setForm({
      company: experience.company,
      position: experience.position,
      startDate: dateInput(experience.startDate),
      endDate: dateInput(experience.endDate),
      description: experience.description || '',
    });
    setError('');
  };

  const remove = async (experience: Experience) => {
    if (!confirm(`Delete ${experience.position} at ${experience.company}?`)) return;
    setError('');
    try {
      await api.delete(`/experiences/${experience.id}`);
      if (editingId === experience.id) reset();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete experience');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="h2">Experience</h1>
        <p className="mt-2 text-sm text-muted-foreground">Keep the public career timeline factual and up to date.</p>
      </div>

      <form onSubmit={submit} className="panel mb-8 max-w-3xl space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{editingId ? 'Edit experience' : 'Add experience'}</h2>
          {editingId && <button type="button" onClick={reset} className="btn-ghost">Cancel</button>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label-field" htmlFor="experience-company">Company</label><input id="experience-company" className="field" value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} required /></div>
          <div><label className="label-field" htmlFor="experience-position">Position</label><input id="experience-position" className="field" value={form.position} onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))} required /></div>
          <div><label className="label-field" htmlFor="experience-start">Start date</label><input id="experience-start" className="field" type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} required /></div>
          <div><label className="label-field" htmlFor="experience-end">End date (blank for current)</label><input id="experience-end" className="field" type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} /></div>
        </div>
        <div><label className="label-field" htmlFor="experience-description">Description</label><textarea id="experience-description" className="field" rows={5} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></div>
        {error && <p className="rounded-xl border border-[#6d3b34] bg-[#2a1614] px-4 py-3 text-sm text-[#e8977f]">{error}</p>}
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update experience' : 'Add experience'}</button>
      </form>

      <div className="space-y-3">
        {experiences.map((experience) => (
          <div key={experience.id} className="panel flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="min-w-0"><p className="font-medium">{experience.position}</p><p className="mt-1 text-sm text-muted-foreground">{experience.company} · {dateInput(experience.startDate)} — {dateInput(experience.endDate) || 'Present'}</p></div>
            <div className="flex shrink-0 gap-2"><button type="button" onClick={() => edit(experience)} className="btn-ghost !px-3 !py-2 text-xs">Edit</button><button type="button" onClick={() => void remove(experience)} className="btn-ghost !px-3 !py-2 text-xs">Delete</button></div>
          </div>
        ))}
      </div>
      {experiences.length === 0 && <p className="text-sm text-muted-foreground">No experience entries yet.</p>}
    </div>
  );
}
