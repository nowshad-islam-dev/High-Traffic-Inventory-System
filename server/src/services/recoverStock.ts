import { Op } from 'sequelize';
import { sequelize } from '../config/db';
import { Reservations, Drops } from '../models';
import { getIO } from '../config/socket';

export async function cleanupExpiredReservations() {
  const t = await sequelize.transaction();
  try {
    const expiredReservations = await Reservations.findAll({
      where: {
        status: 'reserved',
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
      transaction: t,
      lock: t.LOCK.UPDATE, // Lock these specific rows
    });

    const affectedDropIds = [
      ...expiredReservations.map((r) => r.dropId),
    ].filter((id) => typeof id === 'number');

    if (expiredReservations.length === 0) {
      await t.rollback();
      return;
    }

    for (const reservation of expiredReservations) {
      await Drops.increment('availableStock', {
        by: 1,
        where: {
          id: reservation.dropId,
        },
        transaction: t,
      });
      reservation.status = 'expired';
      await reservation.save({ transaction: t });
    }

    await t.commit();

    // Notify via websockets
    const io = getIO();
    const updatedDrops = await Drops.findAll({
      where: {
        id: affectedDropIds,
      },
    });
    updatedDrops.forEach((drop) => {
      io.emit('stock_update', {
        dropId: drop.id,
        availableStock: drop.availableStock,
      });
    });

    console.log(
      `Successfully recovered ${expiredReservations.length} stock units.`,
    );
  } catch (err) {
    console.error('Failed to recover stocks');
    await t.rollback();
  }
}
