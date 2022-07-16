import { Order } from './order';
import amqp from 'amqplib';
import { logger } from './logger';
import { CreditCard } from './credit-card';

const ORDER_CREATED_QUEUE = 'order_created';

export class Events {
  private static connection: amqp.Connection | null = null;

  static async dispatchOrderCreated(order: Order, creditCard: CreditCard) {
    const connection = await this.getConnection();
    logger('Creating queue channel');
    const channel = await connection.createChannel();
    channel.assertQueue(ORDER_CREATED_QUEUE, { durable: true });
    const message = Buffer.from(JSON.stringify({ ...order.json(), ...creditCard }));
    logger(`Sending message to queue: ${message}`);
    channel.sendToQueue(ORDER_CREATED_QUEUE, message, { persistent: true });
  }

  private static async getConnection() {
    if (!this.connection) {
      logger('Connecting to RabbitMq');
      this.connection = await amqp.connect('amqp://localhost');
    }
    return this.connection;
  }
}
