const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

async function getSkills() {
  try {
    const res = await fetch(`${API_URL}/skills`, { next: { revalidate: 300 } });
    if (res.ok) return res.json();
  } catch {}
  return [];
}

export default async function AboutPage() {
  const skills = await getSkills();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">About</h1>

      <div className="mb-12 space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          I&apos;m a DevOps Engineer at SmartSigma, based in Cairo, Egypt. I build and maintain
          production infrastructure serving thousands of users across a fleet of VPS servers.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          My work spans Docker containerization, Kubernetes orchestration, CI/CD pipelines,
          database administration, reverse proxy configuration, monitoring, and AI-powered
          platform engineering. I believe in infrastructure that &ldquo;just works&rdquo; — reliable,
          observable, and automated.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          I&apos;m currently expanding into AI engineering — building RAG systems, LLM integrations,
          and MCP servers. This platform (Ahmed OS) is both my portfolio and my AI playground.
        </p>
      </div>

      {skills.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Skills</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill: any) => (
              <div key={skill.id} className="rounded-lg border p-4">
                <p className="font-medium">{skill.name}</p>
                {skill.category && (
                  <p className="text-xs text-muted-foreground">{skill.category}</p>
                )}
                {skill.level && (
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-full rounded-full ${
                          i < skill.level ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-6 text-2xl font-bold">Currently</h2>
        <div className="rounded-lg border p-6">
          <p className="font-medium">DevOps Engineer @ SmartSigma</p>
          <p className="text-sm text-muted-foreground">Cairo, Egypt</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Building and maintaining production infrastructure across 7 VPS servers,
            10+ applications, Docker, Traefik, MySQL, and AI integrations.
          </p>
        </div>
      </section>
    </div>
  );
}
