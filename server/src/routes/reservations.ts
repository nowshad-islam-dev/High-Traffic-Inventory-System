import { Router } from 'express';
import { reserveItem } from '../controllers/reservations';

const router = Router();

router.post('/:dropId', async (req, res) => {
  const { userId } = req.body;
  const { dropId } = req.params;
  const result = await reserveItem(parseInt(userId), parseInt(dropId));
  res.json(result);
});

export default router;
