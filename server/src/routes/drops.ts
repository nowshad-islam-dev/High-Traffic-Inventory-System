import { Router } from 'express';
import {
  getAllDrops,
  getDropsWithUserInformation,
  createDrop,
} from '../controllers/drops';

const router = Router();

router.get('/', async (req, res) => {
  const result = await getAllDrops();
  res.json(result);
});

router.get('/latest', async (req, res) => {
  const result = await getDropsWithUserInformation();
  res.json(result);
});

router.post('/', async (req, res) => {
  const { name, price, stock } = req.body;
  const result = await createDrop(name, price, stock);
  res.status(201).json(result);
});

export default router;
