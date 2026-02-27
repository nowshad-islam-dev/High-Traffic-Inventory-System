import express from 'express';
import { join } from 'node:path';
import { createProduct, getProducts } from './controllers';

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.sendFile(join(__dirname, 'index.html')));
app.get('/products', getProducts);
app.post('/products', createProduct);

export default app;
