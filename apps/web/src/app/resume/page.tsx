const API_URL = process.env.API_URL || 'http://localhost:4000/api/v1';

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

export default async function ResumePage() {
  const { skills, experiences } = await getData();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Resume</h1>
        <button className="rounded-md border px-4 py-2 text-sm transition-colors hover:bg-accent">
          Download PDF
        </button>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold">Ahmed Ekram Al Sada</h2>
        <p className="text-muted-foreground">DevOps Engineer & Software Architect</p>
        <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
          <span>Cairo, Egypt</span>
          <a href="mailto:ahmedekramalsada@gmail.com" className="hover:text-foreground">ahmedekramalsada@gmail.com</a>
          <a href="https://linkedin.com/in/ahmedekramalsada" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
          <a href="https://github.com/ahmedekramalsada" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
        </div>
      </div>

      {/* Experience */}
      <section className="mb-12">
        <h3 className="mb-4 text-xl font-semibold">Experience</h3>
        {experiences.length === 0 ? (
          <div className="rounded-lg border p-6">
            <p className="font-medium">DevOps Engineer</p>
            <p className="text-sm text-muted-foreground">SmartSigma · Cairo</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Managing production infrastructure, CI/CD pipelines, Docker orchestration,
              and AI platform integrations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp: any) => (
              <div key={exp.id} className="rounded-lg border p-6">
                <p className="font-medium">{exp.position}</p>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                {exp.description && <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Skills</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {skills.map((skill: any) => (
              <div key={skill.id} className="rounded-lg border p-3 text-center">
                <p className="text-sm font-medium">{skill.name}</p>
                {skill.category && (
                  <p className="text-xs text-muted-foreground">{skill.category}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section>
        <h3 className="mb-4 text-xl font-semibold">Education</h3>
        <div className="rounded-lg border p-6">
          <p className="font-medium">Computer Science</p>
          <p className="text-sm text-muted-foreground">Cairo, Egypt</p>
        </div>
      </section>
    </div>
  );
}
