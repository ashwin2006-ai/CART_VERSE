import { defineConfig } from 'prisma';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/auraluxe_ecommerce?schema=public'
  }
});
