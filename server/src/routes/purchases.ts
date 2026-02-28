import { Router } from 'express';
import { purchaseItem } from '../controllers/purchases';

const router = Router();

router.post('/:reservationId', async (req, res) => {
  const { userId } = req.body;
  const { reservationId } = req.params;
  const result = await purchaseItem(parseInt(reservationId), parseInt(userId));
  res.status(201).json(result);
});

export default router;
