import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined.');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

const languages = [
  {
    code: 'RU',
    name: 'Русский',
  },
  {
    code: 'EN',
    name: 'English',
  },
  {
    code: 'HY',
    name: 'Հայերեն',
  },
  {
    code: 'DE',
    name: 'Deutsch',
  },
  {
    code: 'ES',
    name: 'Español',
  },
  {
    code: 'FR',
    name: 'Français',
  },
  {
    code: 'IT',
    name: 'Italiano',
  },
  {
    code: 'PT',
    name: 'Português',
  },
  {
    code: 'TR',
    name: 'Türkçe',
  },
] as const;

async function main() {
  console.log('Seeding languages...');

  for (const language of languages) {
    await prisma.language.upsert({
      where: {
        code: language.code,
      },
      update: {
        name: language.name,
      },
      create: {
        code: language.code,
        name: language.name,
      },
    });

    console.log(`✓ ${language.code} — ${language.name}`);
  }

  console.log('Languages seeded successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
