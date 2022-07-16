import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Events } from './events';

const app = express();
app.use(express.json());
app.use(cors());

Events.initConsumers();

app.listen(3002, () => {
  console.log('Payments running at http://localhost:3002');
});
