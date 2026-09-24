import Link from 'next/link';
import { Pipeline } from '@/components/site/pipeline';
import { Terminal, type TerminalData } from '@/components/site/terminal';
import { MotionProvider, Reveal } from '@/components/site/reveal';
import { Spotlight } from '@/components/site/spotlight';
import { TiltCard } from '@/components/site/tilt-card';
import { Cover } from '@/components/site/cover';
import { JsonLd } from '@/components/site/json-ld';
import { CONTACT, HELP, PROOF, STAGES, TOOL_GROUPS, localePath, type Locale } from '@/lib/site-content';
import { getPosts, getProjects, formatDate, techName, projectInitials } from '@/lib/public-content';
import { projectCopy, publicProjectSlugs } from '@/lib/project-copy';

const copy = {
  en: {
    heroLines: ['I build the rails', 'production runs on.', 'Then I keep watch.'],
    heroBody: 'DevOps Engineer in Cairo. I build reliable cloud platforms and AI-powered business systems, then keep the work understandable and reversible.',
    viewWork: 'View the work', readWriting: 'Read the writing', proofTitle: 'A few facts before the story', helpTitle: 'What I work on', workTitle: 'Selected work', workLede: 'Three public examples of how I connect infrastructure, automation, and documentation.', featuredTitle: 'What I am writing', latestTitle: 'Latest writing', aboutTitle: 'A short introduction', aboutBody: 'I am a DevOps Engineer in Cairo. I care about dependable systems, useful automation, and explaining the decisions behind the work.', seeAbout: 'Read the full story', howTitle: 'How I work', howLede: 'A reliable change has a visible path, a health gate, and a way back.', terminalTitle: 'Ask the terminal who I am', terminalBody: 'The terminal uses the same public data as the rest of this site. Try whoami, stack, projects, or how.', closingTitle: 'Reliable infrastructure is quiet. Hiring for it is loud.', closingBody: 'If you need someone to build the platform, automate the delivery, and keep it boring, send me the problem.', start: 'Start a conversation', email: 'Email me',
  },
  ar: {
    heroLines: ['أبني البنية التي', 'تعمل عليها الأنظمة.', 'ثم أراقب التشغيل.'],
    heroBody: 'مهندس DevOps في القاهرة. أبني منصات سحابية موثوقة وأنظمة أعمال مدعومة بالذكاء الاصطناعي، مع الحفاظ على وضوح العمل وسهولة التراجع عنه.',
    viewWork: 'شاهد الأعمال', readWriting: 'اقرأ الكتابة', proofTitle: 'حقائق قليلة قبل القصة', helpTitle: 'ما الذي أعمل عليه', workTitle: 'أعمال مختارة', workLede: 'ثلاثة أمثلة عامة توضح كيف أربط البنية التحتية والأتمتة والتوثيق.', featuredTitle: 'ما الذي أكتبه', latestTitle: 'أحدث الكتابة', aboutTitle: 'تعريف سريع', aboutBody: 'أنا مهندس DevOps في القاهرة. أهتم بالأنظمة الموثوقة والأتمتة المفيدة، وشرح القرارات التي تقف خلف العمل.', seeAbout: 'اقرأ القصة كاملة', howTitle: 'كيف أعمل', howLede: 'التغيير الموثوق له مسار واضح، وفحص صحة، وطريقة للرجوع.', terminalTitle: 'اسأل الطرفية من أنا', terminalBody: 'تستخدم الطرفية نفس البيانات العامة التي يستخدمها الموقع. جرّب whoami أو stack أو projects أو how.', closingTitle: 'البنية التحتية الموثوقة هادئة. الحفاظ عليها يحتاج إلى من يبنيها ويحرص على بقائها كذلك', closingBody: 'إذا كنت تحتاج شخصًا يبني المنصة، ويؤتمت التسليم، ويبقيها بسيطة، فأرسل لي المشكلة.', start: 'ابدأ محادثة', email: 'راسلني بالبريد',
  },
} as const;

export async function PublicHome({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [{ data: posts }, allProjects] = await Promise.all([getPosts({ locale, limit: 50 }), getProjects()]);
  const slugs = new Set(publicProjectSlugs());
  const projects = allProjects.filter((project) => slugs.has(project.slug));
  const featured = posts[0];
  const latest = posts.slice(1, 4);
  const terminalSkills = TOOL_GROUPS[locale].flatMap((group) => group.items);
  const terminalData: TerminalData = {
    name: locale === 'ar' ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada',
    role: 'DevOps Engineer',
    location: locale === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt',
    focus: locale === 'ar' ? 'منصات الحاويات وخطوط التسليم والمراقبة' : 'container platforms, delivery pipelines, and monitoring that tells me before a user does',
    skills: terminalSkills,
    projects: projects.map((project) => ({ title: projectCopy(locale, project.slug)?.title || project.title, stack: (project.technologies || []).map(techName) })),
    posts: posts.map((post) => ({ title: post.title, date: formatDate(post.publishedAt, locale), tags: post.tags?.map((tag) => tag.name) || [] })),
    contact: { email: CONTACT.email, github: CONTACT.github, linkedin: CONTACT.linkedin },
  };

  return (
    <div className="relative">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: locale === 'ar' ? 'أحمد أكرم السادة — مهندس DevOps' : 'Ahmed Ekram Alsada — DevOps Engineer',
        url: `https://ahmedekram.site${localePath(locale)}`,
        inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US',
        mainEntity: { '@type': 'Person', name: locale === 'ar' ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada', jobTitle: 'DevOps Engineer', url: `https://ahmedekram.site${localePath(locale, '/about')}`, sameAs: [CONTACT.github, CONTACT.linkedin] },
        description: t.heroBody,
      }} />
      <MotionProvider />
      <Spotlight />
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 pt-28 lg:px-8 lg:pt-36">
        <div className="grid gap-14 lg:grid-cols-[1.28fr_.72fr] lg:items-end">
          <div>
            <div className="fade-up relative mb-7 h-[112px] w-[112px]">
              <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-warm/35 to-live/25 blur-[10px]" aria-hidden />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/profile.webp" alt="Ahmed Ekram Alsada" width={112} height={112} className="relative h-[112px] w-[112px] rounded-full border border-line-2 object-cover" style={{ objectPosition: '50% 20%' }} />
            </div>
            <div className="fade-up inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[.09em] text-muted-foreground"><span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-ok" />{locale === 'ar' ? 'مهندس DevOps · القاهرة' : 'DevOps Engineer · Cairo'}</div>
            <h1 className="mt-7 text-[clamp(2.1rem,8.4vw,6.2rem)] font-semibold leading-[1.06] tracking-[-.045em] lg:leading-[1.04]">
              {t.heroLines.map((line, index) => <span className="kline" key={line}><span className={index === 2 ? 'text-warm' : ''}>{line}</span></span>)}
            </h1>
            <p className="fade-up fade-up-1 mt-7 max-w-[56ch] text-[16.5px] leading-relaxed text-muted-foreground">{t.heroBody}</p>
            <div className="fade-up fade-up-2 mt-9 flex flex-wrap gap-3"><Link href={localePath(locale, '/projects')} className="btn-primary">{t.viewWork} <span aria-hidden>→</span></Link><Link href={localePath(locale, '/blog')} className="btn-ghost">{t.readWriting}</Link></div>
          </div>
          <aside className="fade-up fade-up-2 panel p-6"><span className="label">{t.proofTitle}</span><dl className="mt-5 flex flex-col gap-4">{PROOF[locale].map((item) => <div key={item.label} className="flex flex-col gap-1"><dt className="font-mono text-[11px] uppercase tracking-[.09em] text-dim">{item.label}</dt><dd className="text-[14.5px]">{item.value}</dd></div>)}</dl></aside>
        </div>
        <div className="mt-14 flex items-center gap-3 text-muted-foreground"><span className="scroll-cue block h-9 w-px bg-gradient-to-b from-line-2 to-transparent" /><span className="font-mono text-[11px] uppercase tracking-[.1em]">Scroll</span></div>
      </section>

      <Reveal className="relative z-10 mx-auto max-w-[1200px] px-6 py-10 lg:px-8"><div className="atlas-proof-strip">{PROOF[locale].map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></Reveal>

      <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:px-8"><div className="atlas-section-head"><div><span className="label">{t.helpTitle}</span><h2 className="mt-4 max-w-[24ch] text-[clamp(1.55rem,5.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-.035em]">{locale === 'ar' ? 'من الفكرة إلى نظام يعمل' : 'From idea to a system that works'}</h2></div></div><div className="mt-9 grid gap-4 md:grid-cols-3">{HELP[locale].map((item, index) => <article key={item.title} className="panel atlas-help-card"><span className="atlas-index">0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><span className="label">{t.workTitle}</span><h2 className="mt-5 max-w-[24ch] text-[clamp(1.55rem,5.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-.035em]">{locale === 'ar' ? 'مشاريع تشرح الطريق من الفكرة إلى التشغيل' : 'Projects that explain the path from idea to operation'}</h2><p className="mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-muted-foreground">{t.workLede}</p></div><Link href={localePath(locale, '/projects')} className="inline-flex min-h-[36px] items-center text-[14px] text-muted-foreground transition hover:text-warm">{t.viewWork} →</Link></div><div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => { const details = projectCopy(locale, project.slug)!; return <TiltCard key={project.id} href={localePath(locale, `/projects/${project.slug}`)} className="panel atlas-project-card"><div className="atlas-project-top"><span className="atlas-project-role">{details.role}</span><span className={`status ${project.status === 'completed' ? 's-ok' : 's-warm'}`}>{project.status === 'completed' ? (locale === 'ar' ? 'مكتمل' : 'Completed') : (locale === 'ar' ? 'قيد التطوير' : 'In progress')}</span></div><div className="atlas-project-media"><Cover src={project.coverImage} alt={details.title} fallback={projectInitials(details.title)} className="atlas-project-art" /></div><div className="atlas-project-body"><span className="atlas-index">PROJECT / {project.slug.toUpperCase()}</span><h2>{details.title}</h2><p className="atlas-project-copy">{details.result}</p><div className="atlas-tech-list">{details.stack.map((tech) => <span key={tech}>{tech}</span>)}</div><span className="atlas-project-open">{locale === 'ar' ? 'اقرأ دراسة الحالة' : 'Read the case study'} <span aria-hidden>→</span></span></div></TiltCard>; })}</div></section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:px-8"><div className="atlas-writing-feature panel"><div><span className="label">{t.featuredTitle}</span>{featured ? <><h2 className="mt-4 text-[clamp(1.55rem,4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-.035em]"><Link href={localePath(locale, `/blog/${featured.slug}`)} className="hover:text-warm">{featured.title}</Link></h2><p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">{featured.excerpt}</p></> : <p className="mt-4 text-muted-foreground">{locale === 'ar' ? 'المقال العربي الأول في الطريق. ابدأ من العمل المختار.' : 'The first article in this language is on its way. Start with the selected work.'}</p>}<Link href={localePath(locale, '/blog')} className="mt-7 inline-flex min-h-[40px] items-center text-[14px] text-warm hover:underline">{t.readWriting} →</Link></div>{featured && <Link href={localePath(locale, `/blog/${featured.slug}`)} className="atlas-writing-art"><Cover src={featured.coverImage} alt={featured.title} fallback={(featured.title || '?')[0].toUpperCase()} /></Link>}</div></section>

      {latest.length > 0 && <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 lg:px-8"><div className="flex items-end justify-between gap-4"><div><span className="label">{t.latestTitle}</span><h2 className="mt-4 text-[clamp(1.55rem,5.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-.035em]">{locale === 'ar' ? 'أفكار قابلة للقراءة' : 'Ideas worth reading'}</h2></div><Link href={localePath(locale, '/blog')} className="inline-flex min-h-[36px] items-center text-[14px] text-muted-foreground transition hover:text-warm">{t.readWriting} →</Link></div><div className="mt-8">{latest.map((post) => <Link key={post.id} href={localePath(locale, `/blog/${post.slug}`)} className="wrow group"><div className="min-w-0"><h3 className="wtitle text-[19px] font-medium leading-snug tracking-[-.02em] transition-colors">{post.title}</h3>{post.excerpt && <p className="mt-2 line-clamp-1 text-[14.2px] text-muted-foreground">{post.excerpt}</p>}</div><span className="shrink-0 font-mono text-[11.5px] uppercase tracking-[.08em] text-dim">{formatDate(post.publishedAt, locale)}</span></Link>)}</div></section>}

      <Reveal className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:px-8"><div className="panel atlas-about-preview"><div><span className="label">{t.aboutTitle}</span><h2 className="mt-4 text-[clamp(1.55rem,4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-.035em]">{locale === 'ar' ? 'من أنا' : 'Who I am'}</h2><p className="mt-4 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground">{t.aboutBody}</p><Link href={localePath(locale, '/about')} className="mt-7 inline-flex min-h-[40px] items-center text-[14px] text-warm hover:underline">{t.seeAbout} →</Link></div><div className="atlas-about-signals">{PROOF[locale].slice(0, 3).map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></div></Reveal>

      <section id="how-it-ships" className="relative z-10 mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24 lg:px-8"><span className="label">{t.howTitle}</span><h2 className="mt-5 max-w-[24ch] text-[clamp(1.55rem,5.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-.035em]">{locale === 'ar' ? 'ما يحدث بين الالتزام والخدمة الحية' : 'What happens between a commit and a live service'}</h2><p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-muted-foreground">{t.howLede}</p><Pipeline stages={STAGES[locale]} /></section>

      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><span className="label">{t.terminalTitle}</span><h2 className="mt-5 max-w-[22ch] text-[clamp(1.55rem,5.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-.035em]">{t.terminalTitle}</h2><p className="mt-5 max-w-[46ch] text-[15.5px] leading-relaxed text-muted-foreground">{t.terminalBody}</p></div><Terminal data={terminalData} locale={locale} /></div></section>

      <Reveal className="relative z-10 mx-auto max-w-[1200px] px-6 pb-28 pt-20 lg:px-8"><span className="label">{locale === 'ar' ? 'التالي' : 'Next'}</span><h2 className="mt-5 max-w-[26ch] text-[clamp(1.8rem,7vw,4rem)] font-semibold leading-[1.08] tracking-[-.04em]">{t.closingTitle}</h2><p className="mt-6 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground">{t.closingBody}</p><div className="mt-9 flex flex-wrap gap-3"><Link href={localePath(locale, '/contact')} className="btn-primary">{t.start} <span aria-hidden>→</span></Link><a href={`mailto:${CONTACT.email}`} className="btn-ghost">{t.email}</a></div></Reveal>
    </div>
  );
}
