import { PrismaClient, Order as PrismaOrder } from '@prisma/client';
import { Item } from '@prisma/client';

export const prismaClient = new PrismaClient();

export type DBItem = Item;

export type DBOrder = PrismaOrder & { items?: DBItem[] };
