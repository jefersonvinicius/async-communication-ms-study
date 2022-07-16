import { PrismaClient, Payment as PrismaPayment } from '@prisma/client';

export const prismaClient = new PrismaClient();

export type DBPayment = PrismaPayment;
