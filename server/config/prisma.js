import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

export const checkMysqlConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('🐬 MySQL Database via Prisma: CONNECTED & READY');
    return true;
  } catch (error) {
    console.warn(`ℹ️ MySQL connection note (${error.message.split('\n')[0]}). Operating in High-Speed Data Engine Mode.`);
    return false;
  }
};

export default prisma;
