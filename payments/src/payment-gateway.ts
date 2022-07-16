import { logger } from './logger';
import { Payment } from './payment';

export class PaymentGateway {
  static pay(payment: Payment) {
    const random = Math.floor(Math.random() * 100);
    logger(`Processing payment: ${payment}`);
    if (random > 50) {
      payment.setToPaid();
    } else {
      throw new Error('Error processing payment');
    }
  }
}
