import { Op } from 'sequelize';
import { getIO } from '../config/socket';
import { sequelize } from '../config/db';
import { Drops, Reservations } from '../models';
import { AppError } from '../utils/AppError';

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
      throw new AppError(400, 'Drop is out of stock');
    }
    // Create Reservation with 60s timeframe
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
    if (!updatedDrop) throw new AppError(404, 'Updated drop not found');

    const io = getIO();
    io.emit('stock_update', {
      dropId: updatedDrop.id,
      availableStock: updatedDrop.availableStock,
    });

    return reservation;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
