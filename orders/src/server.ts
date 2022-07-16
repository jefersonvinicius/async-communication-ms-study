import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { logger } from './logger';
import { OrderFactory, OrderRepository } from './order';
import { Events } from './events';
import { CreditCardFactory } from './credit-card';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/orders', async (request, response) => {
  const order = OrderFactory.fromRequest(request);
  logger('Saving order');
  const saved = await OrderRepository.save(order);
  logger('Order saved');
  const creditCard = CreditCardFactory.fromRequest(request);
  await Events.dispatchOrderCreated(saved, creditCard);
  return response.json({ cart: saved.json() });
});

app.get('/orders/:id', async (request, response) => {
  const order = await OrderRepository.getById(Number(request.params.id));
  if (!order) return response.status(404).json({ message: 'Not found' });

  return response.json({ order: order.json() });
});

app.listen(3001, () => {
  console.log('Orders running at http://localhost:3001');
});
