import { Drops, Purchases, Users } from '../models';

export async function createDrop(name: string, price?: number, stock?: number) {
  const newDrop = await Drops.create({
    name,
    price: price || 0,
    totalStock: stock || 0,
    availableStock: stock || 0,
  });
  return newDrop;
}

export async function getAllDrops() {
  return await Drops.findAll();
}

export async function getDropsWithUserInformation() {
  const drops = await Drops.findAll({
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Purchases,
        limit: 3,
        order: [['purchasedAt', 'DESC']],
        include: [
          {
            model: Users,
            attributes: ['username'],
          },
        ],
      },
    ],
    subQuery: false,
  });
  return drops;
}
