const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import type { Metadata } from 'next';
import { DownloadButton } from './download-button';

export const metadata: Metadata = {
  title: 'Résumé',
  description: 'DevOps Engineer. Docker, Kubernetes, CI/CD, Cloud Infrastructure.',
  openGraph: { title: 'Resume — Ahmed Ekram Alsada', description: 'DevOps Engineer resume.' },
};

async function getData() {
  try {
    const [skillsRes, expRes] = await Promise.all([
      fetch(`${API_URL}/skills`, { next: { revalidate: 300 } }),
      fetch(`${API_URL}/experiences`, { next: { revalidate: 300 } }),
    ]);
    return {
      skills: skillsRes.ok ? await skillsRes.json() : [],
      experiences: expRes.ok ? await expRes.json() : [],
    };
  } catch {
    return { skills: [], experiences: [] };
  }
}

const FALLBACK_EXPERIENCE = {
  position: 'DevOps Engineer',
  company: 'SmartSigma · Cairo',
  description: 'Managing production infrastructure, CI/CD pipelines, Docker orchestration, and platform integrations.',
};

const EDUCATION = {
  title: 'B.Eng. in Communications and Electronics Engineering',
  meta: 'Modern Academy University · Cairo, Egypt · 2023',
};

const LANGUAGES = ['Arabic — Native', 'English — Intermediate'];

export default async function ResumePage() {
  const { skills, experiences } = await getData();
  const roles = experiences.length === 0 ? [FALLBACK_EXPERIENCE] : experiences;

  return (
    <div className="page">
      <header className="mb-12 flex flex-wrap items-start justify-between gap-6">
        <div>
          <span className="label">Résumé</span>
          <h1 className="h1 mt-5">Ahmed Ekram Alsada</h1>
          <p className="mt-4 text-[15px] text-muted-foreground">DevOps Engineer & Software Architect</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11.5px] uppercase tracking-[.08em] text-dim">
            <span>Cairo, Egypt</span>
            <a href="mailto:ahmedekramalsada@gmail.com" className="transition hover:text-warm">ahmedekramalsada@gmail.com</a>
            <a href="https://linkedin.com/in/ahmedekramalsada" target="_blank" rel="noopener noreferrer" className="transition hover:text-warm">LinkedIn</a>
            <a href="https://github.com/ahmedekramalsada" target="_blank" rel="noopener noreferrer" className="transition hover:text-warm">GitHub</a>
          </div>
        </div>
        <DownloadButton />
      </header>

      {/* Experience */}
      <section className="mb-16">
        <h2 className="label mb-7">Experience</h2>
        <div className="flex flex-col gap-4">
          {roles.map((exp: { id?: string; position?: string; company?: string; description?: string }) => (
            <div key={exp.id || exp.position} className="panel p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[17px] font-medium tracking-[-.015em]">{exp.position}</p>
                <span className="font-mono text-[11px] uppercase tracking-[.08em] text-dim">{exp.company}</span>
              </div>
              {exp.description && (
                <p className="mt-3 max-w-[70ch] text-[14.5px] leading-relaxed text-muted-foreground">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-16">
          <h2 className="label mb-7">Skills</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill: { id: string; name: string; category?: string }) => (
              <div key={skill.id} className="panel p-4">
                <p className="text-[14.5px] font-medium">{skill.name}</p>
                {skill.category && <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[.08em] text-dim">{skill.category}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section className="mb-16">
        <h2 className="label mb-7">Education</h2>
        <div className="panel p-6">
          <p className="text-[17px] font-medium tracking-[-.015em]">{EDUCATION.title}</p>
          <p className="mt-2 text-[14.5px] text-muted-foreground">{EDUCATION.meta}</p>
        </div>
      </section>

      {/* Languages */}
      <section>
        <h2 className="label mb-7">Languages</h2>
        <div className="flex flex-wrap gap-3">
          {LANGUAGES.map((language) => (
            <span key={language} className="chip">{language}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
