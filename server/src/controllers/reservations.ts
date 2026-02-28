import { Op } from 'sequelize';
import { io } from '..';
import { sequelize } from '../config/db';
import { Drops, Reservations } from '../models';

export async function reserveItem(userId: number, dropId: number) {
  const t = await sequelize.transaction();

  try {
    const [affectedCount] = await Drops.update(
      { availableStock: sequelize.literal('"availableStock" - 1') },
      {
        where: {
          id: dropId,
          availableStock: { [Op.gt]: 0 },
        },
        transaction: t,
      },
    );

    if (affectedCount === 0) {
      throw new Error('SOLD_OUT');
    }

    const reservation = await Reservations.create(
      {
        userId,
        dropId,
        status: 'reserved',
        expiresAt: new Date(Date.now() + 60000),
      },
      { transaction: t },
    );

    await t.commit();

    const updatedDrop = await Drops.findByPk(dropId, { raw: true });
    if (!updatedDrop) throw new Error('UPDATED_DROP_NULL');

    io.emit('stock_update', {
      //@ts-ignore
      dropId: updatedDrop.id,
      //@ts-ignore
      availableStock: updatedDrop.availableStock,
    });

    return reservation;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
