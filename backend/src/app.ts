import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { syncDatabase } from './config/db';
import { setupSwagger } from './docs/swagger';
import router from './routes';

dotenv.config();

syncDatabase(false);

const app = express();

app.use(morgan('dev'));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

setupSwagger(app);

app.use('/api', router);

app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

export default app;