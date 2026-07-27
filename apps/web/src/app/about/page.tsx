const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Ahmed Ekram Al Sada',
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

export default async function AboutPage() {
  const [skills, experiences] = await Promise.all([getSkills(), getExperiences()]);

  const tools = [
    { cat: 'Containers', items: ['Docker', 'Docker Compose', 'Kubernetes'] },
    { cat: 'CI/CD', items: ['GitLab CI', 'GitHub Actions', 'Jenkins', 'SonarQube'] },
    { cat: 'Infrastructure', items: ['Terraform', 'Ansible', 'Traefik', 'NGINX', 'Caddy'] },
    { cat: 'Cloud', items: ['AWS', 'Cloudflare R2', 'BunnyCDN'] },
    { cat: 'Monitoring', items: ['Prometheus', 'Grafana', 'Healthchecks.io', 'Uptime Kuma'] },
    { cat: 'Backend', items: ['NestJS', 'Spring Boot', 'PostgreSQL', 'MySQL', 'Redis', 'Qdrant'] },
    { cat: 'Frontend', items: ['Next.js', 'React', 'Tailwind'] },
    { cat: 'AI', items: ['LangChain', 'OpenRouter', 'RAG', 'MCP', 'Qdrant'] },
  ];

  const certs = [
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025' },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          DevOps engineer at SmartSigma, building and automating production infrastructure 
          across 7 VPS servers. Passionate about AI-powered automation, platform engineering, 
          and creating systems that just work.
        </p>
      </section>

      {/* Journey */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">My Journey</h2>
        <div className="border-l-2 border-blue-500/30 space-y-8">
          <div className="pl-6">
            <p className="text-sm text-blue-500 font-medium">May 2026 — Present</p>
            <p className="font-semibold">DevOps Engineer @ SmartSigma</p>
            <p className="text-sm text-muted-foreground">Managing production infrastructure, CI/CD pipelines, Docker orchestration, SSL automation, and AI platform integrations across 7 VPS servers.</p>
          </div>
          <div className="pl-6">
            <p className="text-sm text-blue-500 font-medium">Sep 2025 — Apr 2026</p>
            <p className="font-semibold">DevOps Intern @ National Telecommunication Institute (NTI)</p>
            <p className="text-sm text-muted-foreground">600+ hours of enterprise training: Linux, cloud, IaC, CI/CD, containers, monitoring.</p>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      {skills.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {skills.map((s: any) => (
              <div key={s.id} className="rounded-lg border bg-card p-3 text-center">
                <p className="text-sm font-medium">{s.name}</p>
                {s.category && <p className="text-xs text-muted-foreground mt-0.5">{s.category}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tools I Use */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Tools I Use Every Day</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {tools.map((group) => (
            <div key={group.cat}>
              <p className="text-sm font-semibold text-blue-500 mb-2">{group.cat}</p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Certifications</h2>
        {certs.length === 0 ? (
          <p className="text-muted-foreground">No certifications yet.</p>
        ) : certs.map((c) => (
          <div key={c.name} className="rounded-lg border bg-card p-4">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.issuer} · {c.year}</p>
          </div>
        ))}
      </section>

      {/* Current Stack */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Current Stack</h2>
        <div className="rounded-lg border bg-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><span className="text-sm font-medium">Platform:</span> <span className="text-sm text-muted-foreground">Ahmed OS (Next.js + NestJS + PostgreSQL)</span></div>
            <div><span className="text-sm font-medium">Servers:</span> <span className="text-sm text-muted-foreground">7 VPS, Ubuntu 24.04, Docker</span></div>
            <div><span className="text-sm font-medium">Reverse Proxy:</span> <span className="text-sm text-muted-foreground">Traefik (auto SSL)</span></div>
            <div><span className="text-sm font-medium">Storage:</span> <span className="text-sm text-muted-foreground">Cloudflare R2, BunnyCDN</span></div>
            <div><span className="text-sm font-medium">AI:</span> <span className="text-sm text-muted-foreground">OpenRouter, LangChain, RAG</span></div>
            <div><span className="text-sm font-medium">Agent:</span> <span className="text-sm text-muted-foreground">Hermes + MCP</span></div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-lg border bg-card p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Let&apos;s Connect</h2>
        <p className="text-muted-foreground mb-4">I&apos;m always open to interesting conversations and opportunities.</p>
        <div className="flex justify-center gap-4">
          <a href="/contact" className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">Contact Me</a>
          <a href="https://linkedin.com/in/ahmedekramalsada" target="_blank" className="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">LinkedIn</a>
          <a href="https://github.com/ahmedekramalsada" target="_blank" className="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors">GitHub</a>
        </div>
      </section>
    </div>
  );
}
