import Link from 'next/link';
import { Suspense } from 'react';
import { Pipeline } from '@/components/site/pipeline';
import { MotionProvider, Reveal } from '@/components/site/reveal';
import { Spotlight } from '@/components/site/spotlight';
import { TiltCard } from '@/components/site/tilt-card';
import { ToolSpotlight, type ToolVariant } from '@/components/site/tool-spotlight';
import { Cover } from '@/components/site/cover';
import { JsonLd } from '@/components/site/json-ld';
import { CONTACT, HELP, STAGES, localePath, type Locale } from '@/lib/site-content';
import { getPosts, formatDate } from '@/lib/public-content';

const copy = {
  en: {
    heroLines: ['I build the rails', 'production runs on.', 'Then I keep watch.'],
    heroBody: 'DevOps Engineer. I build reliable cloud platforms and AI-powered business systems, then keep the work understandable and reversible.',
    viewWork: 'View the work', readWriting: 'Read the writing', proofTitle: 'A few facts before the story', helpTitle: 'Stack', workTitle: 'Selected work', workLede: 'Three public examples of how I connect infrastructure, automation, and documentation.', featuredTitle: 'What I am writing', latestTitle: 'Latest writing', aboutTitle: 'A short introduction', aboutBody: 'I am a DevOps Engineer. I care about dependable systems, useful automation, and explaining the decisions behind the work.', seeAbout: 'Read the full story', howTitle: 'How I work', howLede: 'A reliable change has a visible path, a health gate, and a way back.', terminalTitle: 'Ask the terminal who I am', terminalBody: 'The terminal uses the same public data as the rest of this site. Try whoami, stack, projects, or how.', closingTitle: 'Reliable infrastructure is quiet. Hiring for it is loud.', closingBody: 'If you need someone to build the platform, automate the delivery, and keep it boring, send me the problem.', focusLabel: 'Current focus', focusValue: 'DevOps · platforms · AI systems', aiAgentsLabel: 'AI agents & chatbots', aiAgentsValue: 'Assistants that answer from your real business data', aiDevOpsLabel: 'AI in DevOps', aiDevOpsValue: 'Automation that watches systems and drafts the fix', start: 'Start a conversation', email: 'Email me',
  },
  ar: {
    heroLines: ['أبني البنية التحتية', 'التي تعتمد عليها الأنظمة.', 'وأضمن استمرار عملها.'],
    heroBody: 'مهندس DevOps. أبني منصات سحابية يعتمد عليها، وأنظمة أعمال ذكية، وأوثّق كل خطوة حتى يبقى العمل مفهومًا وقابلًا للتراجع.',
    viewWork: 'شاهد أعمالي', readWriting: 'اقرأ مقالاتي', proofTitle: 'أرقام سريعة قبل التفاصيل', helpTitle: 'البنية', workTitle: 'أعمال مختارة', workLede: 'ثلاثة مشاريع حقيقية: من الفكرة إلى نظام يعمل، بالبنية السليمة والتوثيق الواضح.', featuredTitle: 'ماذا أكتب', latestTitle: 'أحدث المقالات', aboutTitle: 'نبذة سريعة', aboutBody: 'أنا مهندس DevOps، شغفي هو الأنظمة المستقرة والأتمتة المفيدة، وشرح القرارات وراء كل عمل.', seeAbout: 'اقرأ قصتي كاملة', howTitle: 'كيف أعمل', howLede: 'أي تغيير موثوق له مسار واضح، وفحص يتأكد من سلامته، وطريق للرجوع عند الحاجة.', terminalTitle: 'اسأل الطرفية عني', terminalBody: 'الطرفية تعرض نفس البيانات العامة الموجودة في الموقع. جرّب: whoami أو stack أو projects أو how.', closingTitle: 'البنية التحتية الجيدة تعمل بصمت. توظيف من يبنيها قرار مهم.', closingBody: 'إذا كنت تبحث عن من يبني المنصة ويؤتمت التسليم ويحافظ على استقرارها، أرسل لي تفاصيل المشكلة.', focusLabel: 'التركيز الحالي', focusValue: 'DevOps · منصات سحابية · ذكاء اصطناعي', aiAgentsLabel: 'وكلاء الذكاء الاصطناعي والشات بوت', aiAgentsValue: 'مساعدات ذكية تجيب عن أسئلتك اعتمادًا على بيانات عملك الفعلية', aiDevOpsLabel: 'الذكاء الاصطناعي في DevOps', aiDevOpsValue: 'أتمتة تراقب الأنظمة وتقترح الإصلاحات', start: 'تواصل معي', email: 'راسلني',
  },
} as const;

export async function PublicHome({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const VARIANTS: ToolVariant[] = ['kubernetes', 'aiagents', 'terraform', 'aws', 'docker', 'cicd', 'aichat', 'observability'];
  const signals = [
    { label: t.focusLabel, value: t.focusValue },
    { label: t.aiAgentsLabel, value: t.aiAgentsValue },
    { label: t.aiDevOpsLabel, value: t.aiDevOpsValue },
  ];

  return (
    <div className="relative">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: locale === 'ar' ? 'أحمد أكرم السادة — مهندس DevOps' : 'Ahmed Ekram Alsada — DevOps Engineer',
        url: `https://ahmedekram.site${localePath(locale)}`,
        inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US',
        mainEntity: { '@type': 'Person', name: locale === 'ar' ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada', alternateName: locale === 'ar' ? 'Ahmed Ekram Alsada' : 'أحمد أكرم السادة', jobTitle: 'DevOps Engineer', url: `https://ahmedekram.site${localePath(locale, '/about')}`, image: 'https://ahmedekram.site/ahmed-ekram-alsada.webp', description: t.heroBody, sameAs: [CONTACT.github, CONTACT.linkedin] },
        description: t.heroBody,
      }} />
      <MotionProvider />
      <Spotlight />
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 pt-28 lg:px-8 lg:pt-36">
        <div className="panel atlas-identity">
          <div className="atlas-identity-photo">
            <div className="relative h-[152px] w-[152px]">
              <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-warm/35 to-live/25 blur-[10px]" aria-hidden />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ahmed-ekram-alsada-152.webp" srcSet="/ahmed-ekram-alsada-152.webp 1x, /ahmed-ekram-alsada-304.webp 2x" alt={locale === 'ar' ? 'أحمد أكرم السادة — مهندس DevOps' : 'Ahmed Ekram Alsada — DevOps Engineer'} title="Ahmed Ekram Alsada" width={152} height={152} fetchPriority="high" className="relative h-[152px] w-[152px] rounded-full border border-line-2 object-cover" style={{ objectPosition: '50% 20%' }} />
            </div>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[.09em] text-muted-foreground"><span className="pulse-dot block h-1.5 w-1.5 rounded-full bg-ok" />{locale === 'ar' ? 'مهندس DevOps' : 'DevOps Engineer'}</div>
          </div>
          <div>
            <span className="label">{t.aboutTitle}</span>
            <p className="mt-4 text-[clamp(1.9rem,5vw,3.2rem)] font-semibold leading-[1.1] tracking-[-.035em]">{locale === 'ar' ? 'من أنا' : 'Who I am'}</p>
            <h1 className="mt-2 text-[clamp(1.4rem,4vw,2.2rem)] font-semibold leading-[1.15] tracking-[-.03em] text-warm">{locale === 'ar' ? 'أحمد أكرم السادة' : 'Ahmed Ekram Alsada'}</h1>
            <p className="mt-4 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground">{t.aboutBody}</p>
            <Link href={localePath(locale, '/about')} className="mt-7 inline-flex min-h-[40px] items-center text-[14px] text-warm hover:underline">{t.seeAbout} →</Link>
            <div className="atlas-about-signals">{signals.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>
          </div>
        </div>
      </section>
      <Suspense fallback={<section className="mx-auto min-h-[280px] max-w-[1200px] px-6 py-16 lg:px-8" aria-busy="true"><span className="label">{t.featuredTitle}</span></section>}><HomeWriting locale={locale} /></Suspense>

      <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:px-8"><div className="atlas-section-head"><div><span className="label">{t.helpTitle}</span><h2 className="mt-4 max-w-[24ch] text-[clamp(1.55rem,5.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-.035em]}">{locale === 'ar' ? 'البنية التي أستخدمها في الإنتاج' : 'Stack I use in production.'}</h2></div></div><div className="mt-9 grid gap-6 lg:grid-cols-2">{HELP[locale].map((item, idx) => <ToolSpotlight key={item.title} index={idx} title={item.title} body={item.body} variant={VARIANTS[idx]} />)}</div></section>
      <section id="how-it-ships" className="relative z-10 mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24 lg:px-8"><span className="label">{t.howTitle}</span><h2 className="mt-5 max-w-[24ch] text-[clamp(1.55rem,5.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-.035em]">{locale === 'ar' ? 'ماذا يحدث بين كتابة الكود وتشغيل الخدمة' : 'What happens between a commit and a live service'}</h2><p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-muted-foreground">{t.howLede}</p><Pipeline stages={STAGES[locale]} /></section>
      <Reveal className="relative z-10 mx-auto max-w-[1200px] px-6 pb-28 pt-20 lg:px-8"><span className="label">{locale === 'ar' ? 'الخطوة التالية' : 'Next'}</span><h2 className="mt-5 max-w-[26ch] text-[clamp(1.8rem,7vw,4rem)] font-semibold leading-[1.08] tracking-[-.04em]">{t.closingTitle}</h2><p className="mt-6 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground">{t.closingBody}</p><div className="mt-9 flex flex-wrap gap-3"><Link href={localePath(locale, '/contact')} className="btn-primary">{t.start} <span aria-hidden>→</span></Link><a href={`mailto:${CONTACT.email}`} className="btn-ghost">{t.email}</a></div></Reveal>
    </div>
  );
}

async function HomeWriting({ locale }: { locale: Locale }) {
  const t = copy[locale];
  // Only the writing section waits for the API, not the above-the-fold profile.
  const { data: posts } = await getPosts({ locale, limit: 3 }).catch(() => ({ data: [] }));
  const featured = posts[0];
  const latest = posts.slice(1, 3);
  return <>
    <section className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 lg:px-8"><div className="atlas-writing-feature panel"><div><span className="label">{t.featuredTitle}</span>{featured ? <><h2 className="mt-4 text-[clamp(1.55rem,4vw,2.5rem)] font-semibold leading-[1.12] tracking-[-.035em]"><Link href={localePath(locale, `/blog/${featured.slug}`)} className="hover:text-warm">{featured.title}</Link></h2><p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">{featured.excerpt}</p></> : <p className="mt-4 text-muted-foreground">{locale === 'ar' ? 'المقالات الجديدة ستظهر هنا أولاً.' : 'New posts will appear here first. The latest 3 will stay on this page.'}</p>}<Link href={localePath(locale, '/blog')} className="mt-7 inline-flex min-h-[40px] items-center text-[14px] text-warm hover:underline">{t.readWriting} →</Link></div>{featured && <Link href={localePath(locale, `/blog/${featured.slug}`)} className="atlas-writing-art"><Cover src={featured.coverImage} alt={featured.title} fallback={(featured.title || '?')[0].toUpperCase()} /></Link>}</div></section>
    {latest.length > 0 && <section className="relative z-10 mx-auto max-w-[1200px] px-6 pb-16 lg:px-8"><div className="flex items-end justify-between gap-4"><div><span className="label">{t.latestTitle}</span><h2 className="mt-4 text-[clamp(1.55rem,5.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-.035em]">{locale === 'ar' ? 'يستحق القراءة' : 'Ideas worth reading'}</h2></div><Link href={localePath(locale, '/blog')} className="inline-flex min-h-[36px] items-center text-[14px] text-muted-foreground transition hover:text-warm">{t.readWriting} →</Link></div><div className="mt-8">{latest.map((post) => <Link key={post.id} href={localePath(locale, `/blog/${post.slug}`)} className="wrow group"><div className="min-w-0"><h3 className="wtitle text-[19px] font-medium leading-snug tracking-[-.02em] transition-colors">{post.title}</h3>{post.excerpt && <p className="mt-2 line-clamp-1 text-[14.2px] text-muted-foreground">{post.excerpt}</p>}</div><span className="shrink-0 font-mono text-[11.5px] uppercase tracking-[.08em] text-dim">{formatDate(post.publishedAt, locale)}</span></Link>)}</div></section>}
  </>;
}
