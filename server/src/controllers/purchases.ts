import { Reservations, Purchases } from '../models';

export async function purchaseItem(reservationId: number, userId: number) {
  const reservation = await Reservations.findByPk(reservationId);

  if (!reservation || reservation.status === 'purchased') {
    throw new Error('RESERVATION_NOT_FOUND_OR_INVALID');
  }

  reservation.status = 'purchased';
  await reservation.save();

  const purchase = await Purchases.create({
    userId: userId!,
    dropId: reservation.dropId!,
  });

  return purchase;
}
