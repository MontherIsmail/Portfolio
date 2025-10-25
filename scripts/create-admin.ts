import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/password';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@portfolio.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword('admin123');

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@portfolio.com',
        password: hashedPassword,
      },
    });


  } catch (error) {
    logger.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
