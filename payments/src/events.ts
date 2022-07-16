import amqp from 'amqplib';
import { logger } from './logger';
import { Payment, PaymentFactory, PaymentRepository } from './payment';
import { PaymentGateway } from './payment-gateway';

const ORDER_CREATED_QUEUE = 'order_created';
const PAYMENT_RECEIVED_QUEUE = 'payment_received';

export class Events {
  private static connection: amqp.Connection | null = null;
  private static channel: amqp.Channel | null = null;

  static async initConsumers() {
    const channel = await this.getChannel();
    channel.assertQueue(ORDER_CREATED_QUEUE, { durable: true });
    channel.consume(ORDER_CREATED_QUEUE, this.handleOrderCreated.bind(this), { noAck: false });
  }

  private static async handleOrderCreated(message: amqp.ConsumeMessage | null) {
    if (!message) return;

    const channel = await this.getChannel();
    try {
      const payment = PaymentFactory.fromCreatedOrderEvent(message);
      const saved = await PaymentRepository.save(payment);
      PaymentGateway.pay(saved);
      channel.ack(message);
      this.dispatchPaymentReceived(saved);
      logger('Payment received correctly');
    } catch (error) {
      logger(`Error on handle payment: ${error}`);
      channel.nack(message);
    }
  }

  private static async dispatchPaymentReceived(payment: Payment) {
    const channel = await this.getChannel();
    channel.assertQueue(PAYMENT_RECEIVED_QUEUE, { durable: true });
    const message = Buffer.from(JSON.stringify(payment));
    logger(`Sending message to queue ${PAYMENT_RECEIVED_QUEUE}: ${message}`);
    channel.sendToQueue(PAYMENT_RECEIVED_QUEUE, message, { persistent: true });
  }

  private static async getChannel() {
    if (!this.channel) {
      const connection = await this.getConnection();
      this.channel = await connection.createChannel();
    }

    return this.channel;
  }

  private static async getConnection() {
    if (!this.connection) {
      logger('Connecting to RabbitMq');
      this.connection = await amqp.connect('amqp://localhost');
    }
    return this.connection;
  }
}
