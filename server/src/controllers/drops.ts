import { Drops, Purchases, Users } from '../models';

export async function createDrop(name: string, price?: number, stock?: number) {
  const newDrop = await Drops.create({
    name,
    price,
    totalStock: stock,
    availableStock: stock,
  });
  return newDrop;
}

export async function getAllDrops() {
  return await Drops.findAll();
}

export async function getLatestDrops() {
  await Drops.findAll({
    include: [
      {
        model: Purchases,
        limit: 3,
        order: ['purchasedAt', 'DESC'],
        include: [
          {
            model: Users,
            attributes: ['username'],
          },
        ],
      },
    ],
  });
}
