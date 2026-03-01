import express from 'express';
import cors from 'cors';
import dropsRouter from './routes/drops';
import usersRouter from './routes/users';
import reservationsRouter from './routes/reservations';
import purchasesRouter from './routes/purchases';
import { errorHandler } from './middlewares/error';
import { AppError } from './utils/AppError';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/drops', dropsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/purchases', purchasesRouter);

// Not found and global error handling
app.use((req, res, next) => {
  next(new AppError(404, 'Opps! Looks like you are lost🔍'));
});
app.use(errorHandler);

export default app;
