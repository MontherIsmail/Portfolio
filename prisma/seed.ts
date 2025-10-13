import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample projects
  const projects = await prisma.project.createMany({
    data: [
      {
        title: 'E-Commerce Platform',
        slug: 'ecommerce-platform',
        description: 'A full-stack e-commerce platform built with Next.js and Node.js',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
        link: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/user/ecommerce',
        technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
        featured: true,
      },
      {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'A collaborative task management application with real-time updates',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71',
        link: 'https://taskapp-demo.com',
        githubUrl: 'https://github.com/user/taskapp',
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
        featured: false,
      },
    ],
  });

  // Create sample skills
  const skills = await prisma.skill.createMany({
    data: [
      { name: 'JavaScript', category: 'Frontend', level: 5, order: 1 },
      { name: 'TypeScript', category: 'Frontend', level: 5, order: 2 },
      { name: 'React', category: 'Frontend', level: 5, order: 3 },
      { name: 'Next.js', category: 'Frontend', level: 4, order: 4 },
      { name: 'Node.js', category: 'Backend', level: 4, order: 5 },
      { name: 'PostgreSQL', category: 'Database', level: 4, order: 6 },
      { name: 'Prisma', category: 'Database', level: 4, order: 7 },
    ],
  });

  // Create sample experiences
  const experiences = await prisma.experience.createMany({
    data: [
      {
        company: 'Tech Corp',
        role: 'Senior Full Stack Developer',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2024-01-01'),
        description: 'Led development of multiple web applications using React and Node.js',
        current: false,
        order: 1,
      },
      {
        company: 'StartupXYZ',
        role: 'Lead Developer',
        startDate: new Date('2024-01-01'),
        description: 'Building scalable web applications and mentoring junior developers',
        current: true,
        order: 2,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

