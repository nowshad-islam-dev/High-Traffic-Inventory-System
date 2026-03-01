import { Reservations, Purchases } from '../models';
import { AppError } from '../utils/AppError';

export async function purchaseItem(reservationId: number, userId: number) {
  const reservation = await Reservations.findByPk(reservationId);

  if (!reservation || reservation.status === 'purchased') {
    throw new AppError(400, 'Reservation not found or invalid');
  }

  reservation.status = 'purchased';
  await reservation.save();

  const purchase = await Purchases.create({
    userId: userId!,
    dropId: reservation.dropId!,
  });

  return purchase;
}
