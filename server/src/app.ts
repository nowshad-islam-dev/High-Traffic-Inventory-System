import express from 'express';
import cors from 'cors';
import dropsRouter from './routes/drops';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/drops', dropsRouter);

export default app;
