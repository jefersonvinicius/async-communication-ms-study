import { Request } from 'express';
import { DBOrder, prismaClient } from './database';
import { Item, ItemFactory, ItemRequestDTO } from './item';

export class Order {
  constructor(readonly id: number | null, readonly items: Item[], readonly payedAt: Date | null) {}

  get total() {
    return this.items.reduce((total, current) => total + current.total, 0);
  }

  json() {
    return {
      ...this,
      total: this.total,
    };
  }
}

export class OrderFactory {
  static fromRequest(request: Request<{}, any, { items: ItemRequestDTO[] }>) {
    const items = request.body.items.map((item) => ItemFactory.fromRequestDTO(item));
    return new Order(null, items, null);
  }

  static fromDbOrder(dbCart: DBOrder) {
    return new Order(dbCart.id, dbCart.items?.map(ItemFactory.fromDBItem) ?? [], dbCart.payedAt);
  }
}

export class OrderRepository {
  static async save(order: Order): Promise<Order> {
    const dbOrder = await prismaClient.order.create({
      data: {
        items: {
          create: order.items.map((item) => ({ amount: item.amount, name: item.name, price: item.price })),
        },
      },
      include: { items: true },
    });
    return OrderFactory.fromDbOrder(dbOrder);
  }

  static async getById(id: number): Promise<Order | null> {
    const dbOrder = await prismaClient.order.findFirst({ where: { id }, include: { items: true } });
    if (!dbOrder) return null;
    return OrderFactory.fromDbOrder(dbOrder);
  }
}
