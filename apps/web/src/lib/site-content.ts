export type Locale = 'en' | 'ar';

export const CONTACT = {
  email: 'Ahmedekramalsada@gmail.com',
  github: 'https://github.com/ahmedekramalsada',
  linkedin: 'https://www.linkedin.com/in/ahmedekramalsada',
};

export const HELP: Record<Locale, { title: string; body: string }[]> = {
  en: [
    { title: 'Kubernetes', body: 'Workloads that survive the night. Deployments, services, and scaling that hold when traffic spikes.' },
    { title: 'AI agents', body: 'Software that runs the errand. Agents that plan, act, and report back — with a human in charge.' },
    { title: 'Terraform', body: 'Infrastructure reviewed like code. Every server born from a file, every change repeatable.' },
    { title: 'AWS', body: 'Cloud that fits the bill. The right service at the right size — nothing idle, nothing mysterious.' },
    { title: 'Docker', body: 'One image, every machine. Built once, running the same from laptop to server.' },
    { title: 'CI/CD pipelines', body: 'Every push earns its release. Tests and gates pass before any user sees a change, with a rollback ready.' },
    { title: 'AI chatbots', body: 'Support that never sleeps. Chatbots that answer from your real business data, not guesses.' },
    { title: 'Observability', body: 'I hear it before you do. Metrics, logs, and alerts that wake me, not your users.' },
  ],
  ar: [
    { title: 'كوبرنيتس', body: 'أحمال تصمد طوال الليل: نشر وخدمات وتوسّع يتماسك وقت ذروة الزيارات.' },
    { title: 'الوكلاء الأذكياء', body: 'برمجيات تنجز المهام: وكلاء يخططون وينفذون ثم يبلغونك، والإنسان هو المسؤول.' },
    { title: 'تيرافورم', body: 'بنية تحتية تُراجَع مثل الكود: كل خادم يولد من ملف، وكل تغيير قابل للتكرار.' },
    { title: 'AWS', body: 'سحابة على المقاس: الخدمة المناسبة بالحجم المناسب، بلا موارد نائمة ولا مفاجآت.' },
    { title: 'دوكر', body: 'صورة واحدة لكل الأجهزة: تُبنى مرة واحدة وتعمل كما هي من اللابتوب إلى الخادم.' },
    { title: 'خطوط التسليم CI/CD', body: 'كل تحديث يستحق إصداره: اختبارات وبوابات قبل أن يرى المستخدم أي تغيير، مع خطة تراجع جاهزة.' },
    { title: 'روبوتات المحادثة', body: 'دعم لا ينام: روبوتات تجيب من بيانات عملك الحقيقية، لا من التخمين.' },
    { title: 'المراقبة', body: 'أسمع العطل قبلك: مقاييس وسجلات وتنبيهات توقظني أنا، لا مستخدميك.' },
  ],
};

export const STAGES: Record<Locale, { title: string; body: string; command: string }[]> = {
  en: [
    { title: 'One commit starts everything', body: 'Every change arrives as a reviewable diff. Nothing reaches a server by hand, so nothing depends on memory of a Friday.', command: 'git push origin main' },
    { title: 'Test, then trust the quality gate', body: 'SonarQube scans every branch for bugs and smells. The pipeline stops here if the quality gate fails.', command: 'sonar-scanner -Dsonar.qualitygate.wait' },
    { title: 'Build once, push to Docker Hub', body: 'The pipeline builds the image from the tagged revision and pushes it. The exact thing tested is the exact thing that ships.', command: 'docker push ahmed/api:$SHA' },
    { title: 'ArgoCD delivers to Kubernetes', body: 'ArgoCD syncs the cluster to the declared state on AWS. No hands on servers, no drift between environments.', command: 'argocd app sync api' },
    { title: 'Verify from inside the system', body: 'Rollout status plus a health probe answering from inside the container — not from the host next to it.', command: 'kubectl rollout status deploy/api' },
    { title: 'Watch it, and stay able to undo it', body: 'Metrics, logs and alerts watch the new revision. The previous one is one command away until the change earns trust.', command: 'argocd app rollback api' },
  ],
  ar: [
    { title: 'التزام واحد يبدأ كل شيء', body: 'يصل كل تغيير على شكل فرق قابل للمراجعة. لا يصل أي شيء إلى الخادم يدويًا، فلا يعتمد النشر على الذاكرة.', command: 'git push origin main' },
    { title: 'اختبر، ثم اعبر بوابة الجودة', body: 'يفحص SonarQube كل فرع بحثًا عن الأخطاء، ويتوقف الخط هنا إذا فشلت بوابة الجودة.', command: 'sonar-scanner -Dsonar.qualitygate.wait' },
    { title: 'ابنِ الصورة مرة وادفعها', body: 'يبني خط البناء الصورة من النسخة الموسومة ويدفعها إلى Docker Hub. ما تم اختباره هو نفسه ما سيُطلق.', command: 'docker push ahmed/api:$SHA' },
    { title: 'ArgoCD يسلّم إلى كوبرنيتس', body: 'تزامن ArgoCD العنقود مع الحالة المعلنة على AWS. لا دخول يدوي إلى الخوادم ولا انحراف بين البيئات.', command: 'argocd app sync api' },
    { title: 'تحقق من داخل النظام', body: 'حالة التدحرج مع فحص صحة يجيب من داخل الحاوية، لا من المضيف المجاور لها.', command: 'kubectl rollout status deploy/api' },
    { title: 'راقب، والتراجع بأمر واحد', body: 'تراقب المقاييس والسجلات والتنبيهات النسخة الجديدة، والنسخة السابقة على بعد أمر واحد حتى تكسب الثقة.', command: 'argocd app rollback api' },
  ],
};

export const TOOL_GROUPS: Record<Locale, { category: string; items: string[] }[]> = {
  en: [
    { category: 'Containers', items: ['Docker', 'Docker Compose', 'Kubernetes', 'Helm'] },
    { category: 'Delivery', items: ['GitLab CI', 'GitHub Actions', 'Jenkins', 'SonarQube'] },
    { category: 'Infrastructure', items: ['Terraform', 'Ansible', 'Traefik', 'NGINX', 'Linux', 'Bash'] },
    { category: 'Cloud', items: ['AWS', 'Cloudflare R2', 'VPS hosting'] },
    { category: 'Monitoring', items: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager'] },
  ],
  ar: [
    { category: 'الحاويات', items: ['Docker', 'Docker Compose', 'Kubernetes', 'Helm'] },
    { category: 'التسليم', items: ['GitLab CI', 'GitHub Actions', 'Jenkins', 'SonarQube'] },
    { category: 'البنية التحتية', items: ['Terraform', 'Ansible', 'Traefik', 'NGINX', 'Linux', 'Bash'] },
    { category: 'السحابة', items: ['AWS', 'Cloudflare R2', 'استضافة VPS'] },
    { category: 'المراقبة', items: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager'] },
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
