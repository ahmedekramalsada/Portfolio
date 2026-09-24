'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

type Skill = {
  id: string;
  name: string;
  category: string | null;
  level: number | null;
  icon: string | null;
};

const emptyForm = { name: '', category: '', level: '5', icon: '' };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setSkills(await api.get<Skill[]>('/skills'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load skills');
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
      const body = {
        name: form.name,
        category: form.category,
        level: Number(form.level),
        icon: form.icon,
      };
      if (editingId) await api.patch(`/skills/${editingId}`, body);
      else await api.post('/skills', body);
      reset();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save skill');
    } finally {
      setSaving(false);
    }
  };

  const edit = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category || '',
      level: skill.level == null ? '' : String(skill.level),
      icon: skill.icon || '',
    });
    setError('');
  };

  const remove = async (skill: Skill) => {
    if (!confirm(`Delete ${skill.name}?`)) return;
    setError('');
    try {
      await api.delete(`/skills/${skill.id}`);
      if (editingId === skill.id) reset();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete skill');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="h2">Skills</h1>
        <p className="mt-2 text-sm text-muted-foreground">Keep the technical capability list accurate and current.</p>
      </div>

      <form onSubmit={submit} className="panel mb-8 max-w-2xl space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{editingId ? 'Edit skill' : 'Add skill'}</h2>
          {editingId && <button type="button" onClick={reset} className="btn-ghost">Cancel</button>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="skill-name">Name</label>
            <input id="skill-name" className="field" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </div>
          <div>
            <label className="label-field" htmlFor="skill-category">Category</label>
            <input id="skill-category" className="field" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
          </div>
          <div>
            <label className="label-field" htmlFor="skill-level">Level (1–10)</label>
            <input id="skill-level" className="field" type="number" min="1" max="10" value={form.level} onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))} />
          </div>
          <div>
            <label className="label-field" htmlFor="skill-icon">Icon key</label>
            <input id="skill-icon" className="field" value={form.icon} onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))} />
          </div>
        </div>
        {error && <p className="rounded-xl border border-[#6d3b34] bg-[#2a1614] px-4 py-3 text-sm text-[#e8977f]">{error}</p>}
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update skill' : 'Add skill'}</button>
      </form>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <div key={skill.id} className="panel flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{skill.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{skill.category || 'Uncategorised'} · level {skill.level ?? '—'}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => edit(skill)} className="btn-ghost !px-3 !py-2 text-xs">Edit</button>
              <button type="button" onClick={() => void remove(skill)} className="btn-ghost !px-3 !py-2 text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills yet.</p>}
    </div>
  );
}
