import { Request } from 'express';

export class CreditCard {
  constructor(readonly creditCard: string, readonly securityNumber: string) {}
}

export class CreditCardFactory {
  static fromRequest(request: Request) {
    return new CreditCard(request.body.creditCard, request.body.securityNumber);
  }
}
