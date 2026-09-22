import Link from 'next/link';
import { Pipeline, type PipelineStage } from '@/components/site/pipeline';
import { Terminal, type TerminalData } from '@/components/site/terminal';
import { Counter, MotionProvider, Reveal } from '@/components/site/reveal';
import { Spotlight } from '@/components/site/spotlight';
import { TiltCard } from '@/components/site/tilt-card';

const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

async function fetchAPI(path: string) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  tags?: string[] | null;
  category?: { name: string } | null;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  technologies?: string[] | null;
  role?: string | null;
  status?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
};

type Skill = { id: string; name: string };

const CONTACT = {
  email: 'Ahmedekramalsada@gmail.com',
  github: 'github.com/ahmedekramalsada',
  linkedin: 'linkedin.com/in/ahmedekramalsada',
};

const STAGES: PipelineStage[] = [
  {
    title: 'A commit, and nothing more',
    body: 'Every change arrives as a reviewable diff. Nothing reaches a server by hand, so nothing depends on my memory of a Friday.',
    command: 'git push origin main',
  },
  {
    title: 'Build the artifact once',
    body: 'The pipeline builds the image from a tagged revision and stores it. The exact thing that was tested is the exact thing that ships.',
    command: 'docker build -t api:$SHA .',
  },
  {
    title: 'Verify before anybody trusts it',
    body: 'Tests run against the built artifact, then a health probe answers from inside the container — not from the host next to it.',
    command: 'curl -fsS localhost:8080/actuator/health',
  },
  {
    title: 'Start the idle side',
    body: 'Blue and green run side by side. The new container starts behind the proxy, receiving no user traffic at all.',
    command: 'docker compose up -d --no-deps blue',
  },
  {
    title: 'Move traffic only after the gate',
    body: 'The proxy switches to the new side once its health check has passed and stayed passed. Users never see a starting service.',
    command: 'traefik: router → blue',
  },
  {
    title: 'Watch it, and stay able to undo it',
    body: 'Metrics, logs and alerts watch the new side. The previous revision is still up, one command away, until the change has earned trust.',
    command: './deploy.sh rollback',
  },
];

const STATUS_LABEL: Record<string, string> = {
  completed: 'Shipped',
  in_progress: 'In progress',
  planning: 'Planned',
};

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function HomePage() {
  const [postsData, projectsData, skillsData, catsData] = await Promise.all([
    fetchAPI('/posts?limit=20&status=published'),
    fetchAPI('/projects?limit=12'),
    fetchAPI('/skills'),
    fetchAPI('/categories'),
  ]);

  const posts: Post[] = postsData?.data || [];
  const projects: Project[] = (projectsData?.data || []).filter(
    (project: Project) => project.title && !/^test\b/i.test(project.title.trim()),
  );
  const skills: Skill[] = Array.isArray(skillsData) ? skillsData : [];
  const categories = Array.isArray(catsData) ? catsData : [];

  const terminalData: TerminalData = {
    name: 'Ahmed Ekram Al Sada',
    role: 'DevOps Engineer',
    company: 'SmartSigma',
    location: 'Cairo, Egypt',
    focus: 'container platforms, delivery pipelines and monitoring that tells me before a user does',
    skills: skills.map((skill) => skill.name),
    projects: projects.map((project) => ({ title: project.title, stack: project.technologies ?? [] })),
    posts: posts.map((post) => ({ title: post.title, date: formatDate(post.publishedAt), tags: post.tags ?? [] })),
    contact: CONTACT,
  };

  const ribbon = skills.length ? [...skills, ...skills] : [];

  return (
    <div className="relative">
      <MotionProvider />
      <Spotlight />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 pt-28 lg:px-8 lg:pt-36">
        <div className="grid gap-14 lg:grid-cols-[1.28fr_.72fr] lg:items-end">
          <div>
            <div className="fade-up inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[.09em] text-muted-foreground">
              <span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-ok" />
              DevOps engineer at SmartSigma · Cairo
            </div>

            <h1 className="mt-7 text-[clamp(2.9rem,7.6vw,6.2rem)] font-semibold leading-[1.04] tracking-[-.045em]">
              <span className="kline">
                <span>I build the rails</span>
              </span>
              <span className="kline">
                <span>production runs on.</span>
              </span>
              <span className="kline">
                <span className="text-warm">Then I keep watch.</span>
              </span>
            </h1>

            <p className="fade-up fade-up-1 mt-7 max-w-[56ch] text-[16.5px] leading-relaxed text-muted-foreground">
              Container platforms, delivery pipelines and monitoring for systems that cannot afford surprises. I work in
              Docker, Kubernetes, Traefik and Terraform — and I would rather roll a change back than explain it twice.
            </p>

            <div className="fade-up fade-up-2 mt-9 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">
                See the work <span aria-hidden>→</span>
              </Link>
              <a href="#how-it-ships" className="btn-ghost">
                How a change ships
              </a>
            </div>
          </div>

          <aside className="fade-up fade-up-2 panel p-6">
            <span className="label">Current state</span>
            <dl className="mt-5 flex flex-col gap-4">
              {[
                ['Role', 'DevOps Engineer · SmartSigma'],
                ['Based in', 'Cairo, Egypt'],
                ['Working with', 'Docker · Kubernetes · Traefik · Terraform'],
                ['Shipped', `${projects.length} projects · ${posts.length} published articles`],
              ].map(([term, value]) => (
                <div key={term} className="flex flex-col gap-1">
                  <dt className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">{term}</dt>
                  <dd className="text-[14.5px]">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="mt-14 flex items-center gap-3 text-muted-foreground">
          <span className="scroll-cue block h-9 w-px bg-gradient-to-b from-line-2 to-transparent" />
          <span className="font-mono text-[11px] uppercase tracking-[.1em]">Scroll</span>
        </div>
      </section>

      {/* ── Stack ribbon ─────────────────────────────────────────────────── */}
      {ribbon.length > 0 && (
        <div className="marquee relative z-10" aria-hidden>
          <div className="marquee-track">
            {ribbon.map((skill, index) => (
              <span key={`${skill.id}-${index}`} className="marquee-item">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── How a change ships ───────────────────────────────────────────── */}
      <section id="how-it-ships" className="relative z-10 mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24 lg:px-8">
        <span className="label">How it ships</span>
        <h2 className="mt-5 max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-.035em]">
          What happens between a commit and a live server
        </h2>
        <p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-muted-foreground">
          Six steps, in this order, every time. Scroll and the rail follows — or click a step to read it on its own.
        </p>
        <Pipeline stages={STAGES} />
      </section>

      {/* ── Work ─────────────────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section id="work" className="relative z-10 mx-auto max-w-[1200px] scroll-mt-24 px-6 py-16 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="label">Selected work</span>
              <h2 className="mt-5 max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-.035em]">
                Things I have built and kept running
              </h2>
            </div>
            <Link href="/projects" className="text-[14px] text-muted-foreground transition hover:text-warm">
              All projects →
            </Link>
          </div>

          <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <TiltCard key={project.id} href={`/projects/${project.slug}`} className="panel block p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-[.09em] text-dim">
                    {project.role || 'Infrastructure'}
                  </span>
                  <span className="rounded-full border border-line-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.08em] text-muted-foreground">
                    {STATUS_LABEL[project.status || ''] || 'Ongoing'}
                  </span>
                </div>

                <h3 className="mt-4 text-[19px] font-medium leading-snug tracking-[-.02em]">{project.title}</h3>
                {project.description && (
                  <p className="mt-2.5 line-clamp-3 text-[14.2px] leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-line bg-muted px-2 py-1 font-mono text-[10.5px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center font-mono text-[11px] uppercase tracking-[.08em] text-warm">
                  <span>Open case study →</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>
      )}

      {/* ── Terminal ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <span className="label">Ask directly</span>
            <h2 className="mt-5 max-w-[22ch] text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-.035em]">
              Ask the terminal who I am
            </h2>
            <p className="mt-5 max-w-[46ch] text-[15.5px] leading-relaxed text-muted-foreground">
              Everything it answers comes from the same database this site reads. Try{' '}
              <code className="rounded-md border border-line bg-muted px-1.5 py-0.5 font-mono text-[13px] text-warm">
                whoami
              </code>
              ,{' '}
              <code className="rounded-md border border-line bg-muted px-1.5 py-0.5 font-mono text-[13px] text-warm">
                stack
              </code>{' '}
              or{' '}
              <code className="rounded-md border border-line bg-muted px-1.5 py-0.5 font-mono text-[13px] text-warm">
                how
              </code>
              .
            </p>
          </div>
          <Terminal data={terminalData} />
        </div>
      </section>

      {/* ── Writing ──────────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="label">Writing</span>
              <h2 className="mt-5 text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-.035em]">
                Notes from production
              </h2>
            </div>
            <Link href="/blog" className="text-[14px] text-muted-foreground transition hover:text-warm">
              All writing →
            </Link>
          </div>

          <div className="mt-10">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="wrow group">
                <div className="min-w-0">
                  <h3 className="wtitle text-[19px] font-medium leading-snug tracking-[-.02em] transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-1 text-[14.2px] text-muted-foreground">{post.excerpt}</p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[11.5px] uppercase tracking-[.08em] text-dim">
                  {formatDate(post.publishedAt)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Numbers ──────────────────────────────────────────────────────── */}
      <Reveal className="relative z-10 mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
        <div className="panel grid divide-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          <Counter value={projects.length} label="Projects built and operated" />
          <Counter value={posts.length} label="Articles published" />
          <Counter value={categories.length} label="Topics on this site" />
          <Counter value={skills.length} label="Tools in the working stack" />
        </div>
      </Reveal>

      {/* ── Closing ──────────────────────────────────────────────────────── */}
      <Reveal className="relative z-10 mx-auto max-w-[1200px] px-6 pb-28 pt-20 lg:px-8">
        <span className="label">Next</span>
        <h2 className="mt-5 max-w-[26ch] text-[clamp(2.1rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-.04em]">
          Reliable infrastructure is quiet. Hiring for it is loud.
        </h2>
        <p className="mt-6 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground">
          If you need someone to build the platform, automate the delivery, and then keep it boring — that is the work I
          do. Send me the problem, not a job title.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">
            Start a conversation <span aria-hidden>→</span>
          </Link>
          <a href={`mailto:${CONTACT.email}`} className="btn-ghost">
            {CONTACT.email}
          </a>
        </div>
      </Reveal>
    </div>
  );
}
