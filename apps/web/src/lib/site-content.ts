export type Locale = 'en' | 'ar';

export const CONTACT = {
  email: 'Ahmedekramalsada@gmail.com',
  github: 'https://github.com/ahmedekramalsada',
  linkedin: 'https://www.linkedin.com/in/ahmedekramalsada',
  location: 'Cairo, Egypt',
};

export const PROOF: Record<Locale, { label: string; value: string }[]> = {
  en: [
    { label: 'Based in', value: 'Cairo, Egypt' },
    { label: 'Current focus', value: 'DevOps · platforms · cloud systems' },
    { label: 'Training', value: '600+ hours at NTI' },
    { label: 'Languages', value: 'Arabic native · English intermediate' },
  ],
  ar: [
    { label: 'المقر', value: 'القاهرة، مصر' },
    { label: 'التركيز الحالي', value: 'DevOps · منصات · أنظمة سحابية' },
    { label: 'التدريب', value: 'أكثر من 600 ساعة في NTI' },
    { label: 'اللغات', value: 'العربية لغة أم · الإنجليزية مستوى متوسط' },
  ],
};

export const HELP: Record<Locale, { title: string; body: string }[]> = {
  en: [
    { title: 'Reliable deployments', body: 'Container builds, CI/CD gates, reverse proxies, and a rollback path designed before the first release.' },
    { title: 'Cloud foundations', body: 'Ubuntu servers, Docker, networking, storage, and the operating details that turn a demo into a service.' },
    { title: 'Practical AI systems', body: 'Business-focused AI workflows connected to real systems, with clear boundaries between data, tools, and approval.' },
  ],
  ar: [
    { title: 'إطلاقات موثوقة', body: 'بناء الحاويات، بوابات الجودة في CI/CD، والبروكسيات العكسية، مع خطة تراجع مصممة قبل أول إطلاق.' },
    { title: 'أساسات سحابية', body: 'خوادم Ubuntu وDocker والشبكات والتخزين، والتفاصيل التشغيلية التي تحول العرض التجريبي إلى خدمة.' },
    { title: 'أنظمة ذكاء اصطناعي عملية', body: 'مسارات ذكاء اصطناعي مرتبطة بأنظمة أعمال حقيقية، مع حدود واضحة بين البيانات والأدوات والموافقة.' },
  ],
};

export const STAGES: Record<Locale, { title: string; body: string; command: string }[]> = {
  en: [
    { title: 'A commit, and nothing more', body: 'Every change arrives as a reviewable diff. Nothing reaches a server by hand, so nothing depends on my memory of a Friday.', command: 'git push origin main' },
    { title: 'Build the artifact once', body: 'The pipeline builds the image from a tagged revision and stores it. The exact thing tested is the exact thing that ships.', command: 'docker build -t api:$SHA .' },
    { title: 'Verify before anybody trusts it', body: 'Tests run against the built artifact, then a health probe answers from inside the container — not from the host next to it.', command: 'curl -fsS localhost:8080/health' },
    { title: 'Start the idle side', body: 'Blue and green run side by side. The new container starts behind the proxy, receiving no user traffic at all.', command: 'docker compose up -d --no-deps blue' },
    { title: 'Move traffic only after the gate', body: 'The proxy switches to the new side once its health check has passed and stayed passed. Users never see a starting service.', command: 'traefik: router → blue' },
    { title: 'Watch it, and stay able to undo it', body: 'Metrics, logs and alerts watch the new side. The previous revision is still up, one command away, until the change has earned trust.', command: './deploy.sh rollback' },
  ],
  ar: [
    { title: 'التزام واحد، لا أكثر', body: 'يصل كل تغيير على شكل فرق قابل للمراجعة. لا يصل أي شيء إلى الخادم يدويًا، حتى لا يعتمد النشر على الذاكرة.', command: 'git push origin main' },
    { title: 'ابنِ نسخة النظام مرة واحدة', body: 'يبني خط البناء الصورة من نسخة موسومة ويخزنها. ما تم اختباره هو نفسه ما سيُطلق.', command: 'docker build -t api:$SHA .' },
    { title: 'تحقق قبل أن يثق أحد', body: 'تعمل الاختبارات على النسخة المبنية، ثم يجيب فحص الصحة من داخل الحاوية، لا من المضيف المجاور لها.', command: 'curl -fsS localhost:8080/health' },
    { title: 'ابدأ النسخة الجانبية', body: 'تعمل النسختان جنبًا إلى جنب. تبدأ الحاوية الجديدة خلف البروكسي ولا تستقبل أي مرور من المستخدمين.', command: 'docker compose up -d --no-deps blue' },
    { title: 'حرّك المرور بعد البوابة فقط', body: 'ينقل البروكسي المرور بعد نجاح فحص الصحة وبقائه مستقرًا. لا يرى المستخدم خدمة في طور البدء.', command: 'traefik: router → blue' },
    { title: 'راقب، وابق قادرًا على التراجع', body: 'تراقب المقاييس والسجلات والتنبيهات النسخة الجديدة. تبقى النسخة السابقة جاهزة للرجوع إليها بأمر واحد.', command: './deploy.sh rollback' },
  ],
};

export const TOOL_GROUPS: Record<Locale, { category: string; items: string[] }[]> = {
  en: [
    { category: 'Containers', items: ['Docker', 'Docker Compose', 'Kubernetes', 'Helm'] },
    { category: 'Delivery', items: ['GitLab CI', 'GitHub Actions', 'Jenkins', 'SonarQube'] },
    { category: 'Infrastructure', items: ['Terraform', 'Ansible', 'Traefik', 'NGINX', 'Linux', 'Bash'] },
    { category: 'Cloud', items: ['AWS', 'Cloudflare R2', 'VPS hosting'] },
    { category: 'Monitoring', items: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager'] },
    { category: 'Backend', items: ['NestJS', 'Spring Boot', 'PostgreSQL', 'MySQL', 'Redis'] },
    { category: 'Frontend', items: ['Next.js', 'React', 'Tailwind'] },
    { category: 'AI systems', items: ['OpenRouter', 'LLM APIs', 'Local models'] },
  ],
  ar: [
    { category: 'الحاويات', items: ['Docker', 'Docker Compose', 'Kubernetes', 'Helm'] },
    { category: 'التسليم', items: ['GitLab CI', 'GitHub Actions', 'Jenkins', 'SonarQube'] },
    { category: 'البنية التحتية', items: ['Terraform', 'Ansible', 'Traefik', 'NGINX', 'Linux', 'Bash'] },
    { category: 'السحابة', items: ['AWS', 'Cloudflare R2', 'استضافة VPS'] },
    { category: 'المراقبة', items: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager'] },
    { category: 'الواجهات الخلفية', items: ['NestJS', 'Spring Boot', 'PostgreSQL', 'MySQL', 'Redis'] },
    { category: 'الواجهات الأمامية', items: ['Next.js', 'React', 'Tailwind'] },
    { category: 'أنظمة الذكاء الاصطناعي', items: ['OpenRouter', 'LLM APIs', 'Local models'] },
  ],
};

export const REPOS: Record<Locale, { label: string; href: string }[]> = {
  en: [
    { label: 'End-to-end DevOps capstone', href: 'https://github.com/ahmedekramalsada/final-project-devops' },
    { label: 'NTI final project', href: 'https://github.com/ahmedekramalsada/final-project' },
    { label: 'Ahmed OS portfolio', href: 'https://github.com/ahmedekramalsada/Portfolio' },
  ],
  ar: [
    { label: 'مشروع تخرج DevOps متكامل', href: 'https://github.com/ahmedekramalsada/final-project-devops' },
    { label: 'مشروع NTI النهائي', href: 'https://github.com/ahmedekramalsada/final-project' },
    { label: 'موقع Ahmed OS', href: 'https://github.com/ahmedekramalsada/Portfolio' },
  ],
};

export function localePath(locale: Locale, path = '/'): string {
  if (locale === 'en') return path;
  if (path === '/') return '/ar';
  if (path.startsWith('/ar')) return path;
  return `/ar${path}`;
}

export function otherLocalePath(locale: Locale, path: string): string {
  if (locale === 'en') return localePath('ar', path);
  if (path === '/ar' || path === '/ar/') return '/';
  return path.startsWith('/ar/') ? path.slice(3) || '/' : path;
}
