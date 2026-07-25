import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Simple SHA-256 hash for dev seed only (not for production)
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function main() {
  // Create admin user
  const adminPassword = hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ahmedekram.site' },
    update: {},
    create: {
      email: 'admin@ahmedekram.site',
      passwordHash: adminPassword,
      name: 'Ahmed Ekram',
      role: 'admin',
      status: 'active',
    },
  });
  console.log('✅ Created admin user:', admin.email, '(password: admin123)');

  // Create default categories
  const categories = [
    'DevOps', 'Backend', 'Frontend', 'AI', 'Cloud',
    'Docker', 'Kubernetes', 'Linux', 'Career', 'Personal',
  ];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description: `${name} category` },
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create default skills
  const skills = [
    { name: 'Docker', category: 'DevOps', level: 5 },
    { name: 'Kubernetes', category: 'DevOps', level: 4 },
    { name: 'Terraform', category: 'DevOps', level: 3 },
    { name: 'AWS', category: 'Cloud', level: 3 },
    { name: 'Linux', category: 'DevOps', level: 5 },
    { name: 'CI/CD', category: 'DevOps', level: 4 },
    { name: 'PostgreSQL', category: 'Backend', level: 4 },
    { name: 'Redis', category: 'Backend', level: 3 },
    { name: 'NestJS', category: 'Backend', level: 4 },
    { name: 'Next.js', category: 'Frontend', level: 3 },
    { name: 'TypeScript', category: 'Frontend', level: 4 },
    { name: 'Traefik', category: 'DevOps', level: 4 },
  ];
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }
  console.log(`✅ Created ${skills.length} skills`);

  // Create default settings
  const defaultSettings = [
    { key: 'site_title', value: 'Ahmed Ekram Al Sada', group: 'general', type: 'string', public: true },
    { key: 'site_description', value: 'DevOps Engineer & Software Architect', group: 'general', type: 'string', public: true },
    { key: 'site_url', value: 'https://ahmedekram.site', group: 'general', type: 'string', public: true },
    { key: 'default_ai_provider', value: 'openai', group: 'ai', type: 'string', public: false },
    { key: 'default_ai_model', value: 'gpt-4o-mini', group: 'ai', type: 'string', public: false },
    { key: 'build_version', value: '0.1.0', group: 'system', type: 'string', public: true },
  ];
  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`✅ Created ${defaultSettings.length} settings`);

  console.log('\n✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
