import express from 'express';
import cors from 'cors';
import dropsRouter from './routes/drops';
import usersRouter from './routes/users';
import reservationsRouter from './routes/reservations';
import purchasesRouter from './routes/purchases';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/drops', dropsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/purchases', purchasesRouter);

export default app;
