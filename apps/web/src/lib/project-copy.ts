import type { Locale } from './site-content';

export type ProjectCopy = {
  title: string;
  role: string;
  problem: string;
  result: string;
  evidence: string;
  body: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
};

export const PROJECT_COPY: Record<Locale, Record<string, ProjectCopy>> = {
  en: {
    'final-project-devops': {
      title: 'End-to-end DevOps capstone',
      role: 'DevOps builder',
      problem: 'A complete delivery workflow needs more than an application: infrastructure, orchestration, automation, and documentation must work together.',
      result: 'A public capstone repository that brings Terraform, Kubernetes, Docker, CI/CD, scripts, and an application into one documented lifecycle.',
      evidence: 'The public repository contains the infrastructure, Kubernetes manifests, pipeline definitions, scripts, application, and documentation.',
      body: 'This is the clearest public example of how I think about DevOps as a connected system. I start with the infrastructure, define the deployment path, package the application, and keep the operating steps in the repository where the next person can inspect them.\n\nThe important part is not the number of tools. It is the path from a change to a running service, with the same information available to the person reviewing it.',
      stack: ['Terraform', 'Kubernetes', 'Docker', 'CI/CD'],
      githubUrl: 'https://github.com/ahmedekramalsada/final-project-devops',
    },
    'final-project': {
      title: 'NTI final project',
      role: 'Training project',
      problem: 'A training program needs a final artifact that demonstrates the skills learned rather than only listing them.',
      result: 'A public NTI final-project repository with source code and supporting documentation.',
      evidence: 'The repository is public and its README identifies it as the NTI final project.',
      body: 'The NTI final project is part of the training record behind my current direction. It helped connect the individual pieces of Linux, cloud, automation, and deployment into one project that other people can inspect.\n\nI treat training work as evidence of learning, not as a substitute for production experience. The portfolio keeps the distinction clear.',
      stack: ['Linux', 'Cloud', 'Automation', 'Documentation'],
      githubUrl: 'https://github.com/ahmedekramalsada/final-project',
    },
    'ahmed-os': {
      title: 'Ahmed OS',
      role: 'Builder',
      problem: 'A personal developer platform should make both the work and the thinking behind the work easy to find and maintain.',
      result: 'A local Next.js and NestJS content platform with portfolio pages, writing, a dashboard, search, and API-backed content.',
      evidence: 'The public source repository is the portfolio codebase; this site is being shaped and verified locally before deployment.',
      body: 'Ahmed OS is my public developer platform: a place for selected work, technical writing, and the small tools that support both.\n\nThe project uses Next.js for the public site, NestJS for the content API, PostgreSQL for structured content, and a dark Systems Atlas visual language that keeps the engineering identity visible without turning the site into a dashboard.\n\nThis page is intentionally honest about its current state: the platform is being built and tested locally, not presented as a finished production deployment.',
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
      githubUrl: 'https://github.com/ahmedekramalsada/Portfolio',
    },
  },
  ar: {
    'final-project-devops': {
      title: 'مشروع تخرج DevOps متكامل',
      role: 'بنيت نظام DevOps',
      problem: 'مسار التسليم الكامل يحتاج أكثر من تطبيق: البنية التحتية والتنسيق والأتمتة والتوثيق يجب أن تعمل معًا.',
      result: 'مشروع تخرج عام يجمع Terraform وKubernetes وDocker وCI/CD والسكربتات والتطبيق في دورة حياة موثقة.',
      evidence: 'المستودع العام يحتوي على البنية التحتية وملفات Kubernetes وتعريفات خطوط البناء والسكربتات والتطبيق والتوثيق.',
      body: 'هذا أوضح مثال عام على طريقة تفكيري في DevOps كمنظومة متصلة. أبدأ من البنية التحتية، وأحدد مسار النشر، وأجهز التطبيق، وأبقي خطوات التشغيل داخل المستودع حتى يستطيع الشخص التالي مراجعتها.\n\nالمهم ليس عدد الأدوات، بل المسار من التغيير إلى الخدمة العاملة، مع بقاء المعلومات متاحة للمراجع.',
      stack: ['Terraform', 'Kubernetes', 'Docker', 'CI/CD'],
      githubUrl: 'https://github.com/ahmedekramalsada/final-project-devops',
    },
    'final-project': {
      title: 'مشروع NTI النهائي',
      role: 'مشروع تدريبي',
      problem: 'يحتاج البرنامج التدريبي إلى ناتج نهائي يثبت المهارات التي تم تعلمها، لا مجرد قائمة بها.',
      result: 'مشروع نهائي عام من NTI يتضمن الشيفرة المصدرية والتوثيق المساند.',
      evidence: 'المستودع عام، ويوضح ملف README أنه مشروع NTI النهائي.',
      body: 'المشروع النهائي لـ NTI جزء من سجل التدريب الذي يقود اتجاري الحالي. ساعدني على وصل أجزاء Linux والسحابة والأتمتة والنشر في مشروع يستطيع الآخرون فحصه.\n\nأتعامل مع العمل التدريبي كدليل على التعلم، لا كبديل عن الخبرة الإنتاجية. يحافظ الموقع على هذا التمييز بوضوح.',
      stack: ['Linux', 'السحابة', 'الأتمتة', 'التوثيق'],
      githubUrl: 'https://github.com/ahmedekramalsada/final-project',
    },
    'ahmed-os': {
      title: 'Ahmed OS',
      role: 'باني المشروع',
      problem: 'يجب أن تجعل منصة المطور الشخصية كل عمل والتفكير خلفه سهلًا في الاكتشاف والصيانة.',
      result: 'منصة محتوى محلية تعتمد Next.js وNestJS، وتضم صفحات الأعمال والكتابة ولوحة إدارة وبحثًا وواجهة برمجية للمحتوى.',
      evidence: 'المستودع العام هو شيفرة الموقع؛ وهذا الموقع ما زال يعمل ويُختبر محليًا قبل النشر.',
      body: 'Ahmed OS هي منصتي العامة للمطورين: مكان للأعمال المختارة والكتابة التقنية والأدوات الصغيرة التي تدعمهما.\n\nيستخدم المشروع Next.js للواجهة العامة، وNestJS لواجهة المحتوى، وPostgreSQL للمحتوى المنظم، وهوية بصرية داكنة تعكس طابع الأنظمة الهندسية من دون تحويل الموقع إلى لوحة تحكم.\n\nهذه الصفحة صريحة حول حالتها الحالية: المنصة ما زالت قيد البناء والاختبار محليًا، ولا أقدمها كإطلاق إنتاجي مكتمل.',
      stack: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
      githubUrl: 'https://github.com/ahmedekramalsada/Portfolio',
    },
  },
};

export function projectCopy(locale: Locale, slug: string) {
  return PROJECT_COPY[locale][slug];
}

export function publicProjectSlugs() {
  return Object.keys(PROJECT_COPY.en);
}
