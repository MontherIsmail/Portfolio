import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/password';

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

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      createdAt: adminUser.createdAt,
    });

    console.log('\nLogin credentials:');
    console.log('Email: admin@portfolio.com');
    console.log('Password: admin123');
    console.log('\nPlease change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
