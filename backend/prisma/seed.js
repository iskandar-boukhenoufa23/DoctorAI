const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const specialists = [
  {
    slug: 'general-medicine',
    name: 'General Medicine',
    description: 'Everyday symptoms and health questions',
  },
  {
    slug: 'cardiology',
    name: 'Cardiology',
    description: 'Heart health, circulation and wellness',
  },
  {
    slug: 'neurology',
    name: 'Neurology',
    description: 'Brain, sleep and nervous system support',
  },
  {
    slug: 'dermatology',
    name: 'Dermatology',
    description: 'Skin, hair and nail concerns',
  },
];

const doctors = [
  {
    name: 'Dr. Mary Ellis',
    specialistSlug: 'general-medicine',
    description: 'General health information for everyday concerns',
    focus: 'general health questions and common symptoms',
  },
  {
    name: 'Dr. Ramy Chen',
    specialistSlug: 'cardiology',
    description: 'Heart and circulation health information',
    focus: 'heart health and circulation questions',
  },
  {
    name: 'Dr. Sarah Patel',
    specialistSlug: 'neurology',
    description: 'Brain, sleep and nervous system health information',
    focus: 'brain, sleep and nervous system questions',
  },
  {
    name: 'Dr. Alex Kim',
    specialistSlug: 'dermatology',
    description: 'Skin, hair and nail health information',
    focus: 'skin, hair and nail questions',
  },
];

async function main() {
  for (const specialist of specialists) {
    await prisma.specialist.upsert({
      where: { slug: specialist.slug },
      update: {
        name: specialist.name,
        description: specialist.description,
        isActive: true,
      },
      create: specialist,
    });
  }

  for (const doctor of doctors) {
    const specialist = await prisma.specialist.findUniqueOrThrow({
      where: { slug: doctor.specialistSlug },
    });
    const existingDoctor = await prisma.doctorAgent.findFirst({
      where: { name: doctor.name, specialistId: specialist.id },
    });

    if (!existingDoctor) {
      await prisma.doctorAgent.create({
        data: {
          name: doctor.name,
          specialistId: specialist.id,
          description: doctor.description,
          systemPrompt: [
            `You are an informational AI assistant focused on ${doctor.focus}.`,
            'You are not a licensed clinician. Do not diagnose, prescribe, or claim certainty.',
            'Offer general information, ask relevant clarifying questions, and encourage users to consult a qualified healthcare professional.',
            'For possible emergencies or severe symptoms, advise the user to contact local emergency services immediately.',
          ].join(' '),
        },
      });
    }
  }

  console.log(`Seeded ${specialists.length} specialist categories and checked ${doctors.length} doctor agents.`);
}

main()
  .catch((error) => {
    console.error('Failed to seed specialist categories:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });