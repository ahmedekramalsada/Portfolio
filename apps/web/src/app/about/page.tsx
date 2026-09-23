const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/site/page-header';

export const metadata: Metadata = {
  title: 'About',
  description: 'DevOps engineer, AI enthusiast, and platform builder. My journey, skills, certifications, and the tools I use every day.',
};

async function getSkills() {
  try {
    const res = await fetch(`${API_URL}/skills`, { next: { revalidate: 300 } });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

async function getExperiences() {
  try {
    const res = await fetch(`${API_URL}/experiences`, { next: { revalidate: 300 } });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

const TIMELINE = [
  {
    period: 'May 2026 — Present',
    role: 'DevOps Engineer',
    body: 'Managing production infrastructure, CI/CD pipelines, Docker orchestration, SSL automation, and platform integrations across a fleet of production VPS servers.',
  },
  {
    period: 'Sep 2025 — Apr 2026',
    role: 'DevOps Intern @ National Telecommunication Institute (NTI)',
    body: '600+ hours of enterprise training: Linux, cloud, IaC, CI/CD, containers, monitoring.',
  },
];

const TOOLS = [
  { cat: 'Containers', items: ['Docker', 'Docker Compose', 'Kubernetes'] },
  { cat: 'CI/CD', items: ['GitLab CI', 'GitHub Actions', 'Jenkins', 'SonarQube'] },
  { cat: 'Infrastructure', items: ['Terraform', 'Ansible', 'Traefik', 'NGINX', 'Caddy'] },
  { cat: 'Cloud', items: ['AWS', 'Cloudflare R2', 'BunnyCDN'] },
  { cat: 'Monitoring', items: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager'] },
  { cat: 'Backend', items: ['NestJS', 'Spring Boot', 'PostgreSQL', 'MySQL', 'Redis'] },
  { cat: 'Frontend', items: ['Next.js', 'React', 'Tailwind'] },
  { cat: 'AI', items: ['OpenRouter', 'LLM APIs', 'Local models'] },
];

const CERTS = [{ name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025' }];

const STACK = [
  ['Platform', 'Ahmed OS (Next.js + NestJS + PostgreSQL)'],
  ['Servers', 'Production VPS fleet · Ubuntu · Docker'],
  ['Delivery', 'GitLab CI with blue/green releases and health gates'],
  ['Reverse proxy', 'Traefik (automatic SSL)'],
  ['Storage', 'Cloudflare R2, BunnyCDN'],
  ['Monitoring', 'Prometheus, Grafana, Loki, Alertmanager'],
];

export default async function AboutPage() {
  const [skills, experiences] = await Promise.all([getSkills(), getExperiences()]);

  return (
    <div className="page">
      <PageHeader
        label="About"
        title="I keep production boring on purpose"
        lede="DevOps engineer building and automating production infrastructure for a fleet of production VPS servers. Passionate about automation, platform engineering, and creating systems that just work."
      />

      {/* Journey */}
      <section className="mb-20">
        <h2 className="label mb-8">My journey</h2>
        <div className="relative pl-8">
          <span className="absolute left-[5px] top-3 bottom-3 w-px bg-line" aria-hidden />
          {TIMELINE.map((entry) => (
            <div key={entry.period} className="relative pb-10 last:pb-0">
              <span className="absolute -left-8 top-[7px] h-3 w-3 rounded-full border-2 border-warm bg-background" aria-hidden />
              <p className="font-mono text-[11.5px] uppercase tracking-[.09em] text-warm">{entry.period}</p>
              <p className="mt-2 text-[17px] font-medium tracking-[-.015em]">{entry.role}</p>
              <p className="mt-2 max-w-[70ch] text-[14.5px] leading-relaxed text-muted-foreground">{entry.body}</p>
            </div>
          ))}
          {experiences.length > 0 && (
            <div className="mt-2 border-t border-line pt-8">
              <p className="label mb-5">From the database</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {experiences.map((exp: { id: string; position?: string; company?: string; description?: string }) => (
                  <div key={exp.id} className="panel p-5">
                    <p className="font-medium">{exp.position}</p>
                    <p className="mt-1 text-[13.5px] text-muted-foreground">{exp.company}</p>
                    {exp.description && <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-20">
          <h2 className="label mb-8">Skills</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill: { id: string; name: string; category?: string }) => (
              <div key={skill.id} className="panel p-4">
                <p className="text-[15px] font-medium">{skill.name}</p>
                {skill.category && <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[.08em] text-dim">{skill.category}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tools */}
      <section className="mb-20">
        <h2 className="label mb-8">Tools I use every day</h2>
        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((group) => (
            <div key={group.cat}>
              <p className="mb-3.5 text-[13.5px] font-medium text-warm">{group.cat}</p>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="text-[14px] text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-20">
        <h2 className="label mb-8">Certifications</h2>
        {CERTS.length === 0 ? (
          <p className="text-muted-foreground">No certifications yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {CERTS.map((cert) => (
              <div key={cert.name} className="panel flex flex-wrap items-center justify-between gap-3 p-5">
                <p className="font-medium">{cert.name}</p>
                <span className="status s-warm">{cert.issuer} · {cert.year}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Current stack */}
      <section className="mb-20">
        <h2 className="label mb-8">Current stack</h2>
        <div className="panel divide-y divide-line">
          {STACK.map(([term, value]) => (
            <div key={term} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">{term}</span>
              <span className="text-[14.5px] text-muted-foreground sm:text-right">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="panel p-8 text-center sm:p-10">
        <h2 className="h2">Let&apos;s talk about your platform</h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
          I&apos;m always open to interesting conversations and opportunities.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/contact" className="btn-primary">Contact me <span aria-hidden>→</span></a>
          <a href="https://linkedin.com/in/ahmedekramalsada" target="_blank" rel="noopener noreferrer" className="btn-ghost">LinkedIn</a>
          <a href="https://github.com/ahmedekramalsada" target="_blank" rel="noopener noreferrer" className="btn-ghost">GitHub</a>
        </div>
      </section>
    </div>
  );
}
