import Link from 'next/link';
import { Cover } from '@/components/site/cover';
import { ArticleContent } from '@/components/site/article-content';
import { JsonLd } from '@/components/site/json-ld';
import { localePath, type Locale } from '@/lib/site-content';
import { getProject } from '@/lib/public-content';
import { projectCopy } from '@/lib/project-copy';
import { notFound } from 'next/navigation';

const copy = { en: { back: 'Back to work', problem: 'The problem', role: 'My role', result: 'The result', evidence: 'Evidence', stack: 'Stack', repository: 'View repository', live: 'Open live project', project: 'Project' }, ar: { back: 'العودة إلى الأعمال', problem: 'المشكلة', role: 'دوري', result: 'النتيجة', evidence: 'الدليل', stack: 'التقنيات', repository: 'شاهد المستودع', live: 'افتح المشروع الحي', project: 'مشروع' } } as const;

export async function PublicProject({ locale, slug }: { locale: Locale; slug: string }) {
  const details = projectCopy(locale, slug);
  if (!details) notFound();
  const project = await getProject(slug);
  if (!project) notFound();
  const t = copy[locale];
  const url = `https://ahmedekram.site${localePath(locale, `/projects/${slug}`)}`;
  return <div className="page" dir={locale === 'ar' ? 'rtl' : 'ltr'}><JsonLd data={{ '@context': 'https://schema.org', '@type': 'Project', name: details.title, description: details.result, url, inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US', creator: { '@type': 'Person', name: locale === 'ar' ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada', url: `https://ahmedekram.site${localePath(locale, '/about')}` }, about: details.problem, keywords: details.stack.join(', '), codeRepository: details.githubUrl || undefined, isAccessibleForFree: true }} /><Link href={localePath(locale, '/projects')} className="mb-4 inline-flex min-h-[36px] items-center gap-2 font-mono text-[11.5px] uppercase tracking-[.09em] text-dim transition hover:text-warm">← {t.back}</Link><header className="mb-10"><div className="flex flex-wrap items-center gap-3"><span className={`status ${project.status === 'completed' ? 's-ok' : 's-warm'}`}>{project.status === 'completed' ? (locale === 'ar' ? 'مكتمل' : 'Completed') : (locale === 'ar' ? 'قيد التطوير' : 'In progress')}</span><span className="status s-warm">{t.project}</span></div><h1 className="h1 mt-6 max-w-[28ch]">{details.title}</h1><p className="lede">{details.result}</p><div className="mt-6 flex flex-wrap gap-2">{details.stack.map((tech) => <span key={tech} className="rounded-md border border-line bg-muted px-2.5 py-1 font-mono text-[11px] text-muted-foreground">{tech}</span>)}</div><div className="mt-8 flex flex-wrap gap-3">{details.githubUrl && <a href={details.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">GitHub ↗</a>}{details.demoUrl && <a href={details.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">{t.live} →</a>}</div></header><div className="panel mb-10 overflow-hidden"><div className="atlas-project-detail-art"><Cover src={project.coverImage} alt={details.title} fallback={project.title.slice(0, 2).toUpperCase()} fallbackFontSize="3.5rem" /></div></div><div className="atlas-case-grid"><section className="panel atlas-case-card"><span className="label">{t.problem}</span><p>{details.problem}</p></section><section className="panel atlas-case-card"><span className="label">{t.role}</span><p>{details.role}</p></section><section className="panel atlas-case-card"><span className="label">{t.result}</span><p>{details.result}</p></section><section className="panel atlas-case-card"><span className="label">{t.evidence}</span><p>{details.evidence}</p></section></div><div className="article rule mt-14 pt-10"><ArticleContent content={details.body} /></div><p className="mt-10 font-mono text-[11px] text-dim">Canonical: {url}</p></div>;
}
