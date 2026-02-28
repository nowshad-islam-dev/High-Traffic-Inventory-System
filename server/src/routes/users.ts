import { Router } from 'express';
import { createUser } from '../controllers/users';

const router = Router();

router.post('/', async (req, res) => {
  const { username } = req.body;
  const result = await createUser(username);
  res.status(201).json(result);
});

export default router;
