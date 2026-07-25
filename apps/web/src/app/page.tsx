import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      {/* Hero Section */}
      <section className="mb-24">
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Ahmed Ekram Al Sada
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          DevOps Engineer & Software Architect
        </p>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          Building production-grade systems at SmartSigma. Specializing in Docker, Kubernetes,
          CI/CD, cloud infrastructure, and AI-powered platform engineering.
        </p>
        <div className="flex gap-4">
          <Link
            href="/projects"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Projects
          </Link>
          <Link
            href="/resume"
            className="rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Download Resume
          </Link>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-24">
        <h2 className="mb-8 text-2xl font-bold">Technologies</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Linux', 'CI/CD', 'PostgreSQL', 'Redis'].map(
            (skill) => (
              <div
                key={skill}
                className="rounded-lg border p-4 text-center text-sm font-medium transition-colors hover:bg-accent"
              >
                {skill}
              </div>
            )
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg border bg-accent/50 p-12 text-center">
        <h2 className="mb-4 text-2xl font-bold">Let&apos;s Work Together</h2>
        <p className="mb-6 text-muted-foreground">
          I&apos;m always open to discussing new projects, creative ideas, or opportunities.
        </p>
        <Link
          href="/contact"
          className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
}
