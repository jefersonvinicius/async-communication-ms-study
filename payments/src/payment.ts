import amqp from 'amqplib';
import { DBPayment, prismaClient } from './database';
import { logger } from './logger';

export class Payment {
  constructor(
    readonly id: number | null,
    readonly creditCard: string,
    readonly securityNumber: string,
    readonly value: number,
    private _paid: boolean,
    readonly orderId: number
  ) {}

  get paid() {
    return this._paid;
  }

  setToPaid() {
    this._paid = true;
  }

  toString() {
    const securityNumber = this.securityNumber
      .split('')
      .map(() => '*')
      .join('');
    return `<Payment: ${this.id},${this.creditCard},${securityNumber},${this.value}>`;
  }
}

export class PaymentFactory {
  static fromCreatedOrderEvent(message: amqp.Message) {
    const parsed = JSON.parse(message.content.toString());
    logger(`Received order created event message: ${JSON.stringify(parsed)}`);
    return new Payment(null, parsed.creditCard, parsed.securityNumber, parsed.total, true, parsed.id);
  }

  static fromDBPayment(dbPayment: DBPayment) {
    return new Payment(
      dbPayment.id,
      dbPayment.creditCard,
      dbPayment.securityNumber,
      dbPayment.value,
      dbPayment.paid,
      dbPayment.orderId
    );
  }
}

export class PaymentRepository {
  static async save(payment: Payment) {
    const alreadyExists = await prismaClient.payment.findFirst({ where: { orderId: payment.orderId } });
    if (alreadyExists) return PaymentFactory.fromDBPayment(alreadyExists);

    const db = await prismaClient.payment.create({
      data: {
        creditCard: payment.creditCard,
        paid: payment.paid,
        securityNumber: payment.securityNumber,
        value: payment.value,
        orderId: payment.orderId,
      },
    });
    return PaymentFactory.fromDBPayment(db);
  }
}
