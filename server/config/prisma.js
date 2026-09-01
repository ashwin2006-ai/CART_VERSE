import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production'
    ? ['error']  // Only log errors in production
    : ['query', 'info', 'warn', 'error']  // Verbose logging in development
});

export const checkPostgresConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('🐘 PostgreSQL Database (Supabase): CONNECTED & READY');
    return true;
  } catch (error) {
    console.warn(`⚠️  PostgreSQL connection note: ${error.message.split('\n')[0]}`);
    console.warn('   App will attempt to reconnect on next request.');
    return false;
  }
};

export default prisma;
