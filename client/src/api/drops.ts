import type { Drop, Reservation, Purchase } from '../types/api';
import api from './client';

export const getDrops = async (): Promise<Drop[]> => {
  const response = await api.get('/drops');
  return response.data;
};

export const reserveDrop = async (
  dropId: number,
  userId?: number,
): Promise<Reservation> => {
  const response = await api.post(`/reservations/${dropId}`, {
    userId: userId || 1,
  });
  return response.data;
};

export const purchaseDrop = async (
  reservationId: number,
  userId?: number,
): Promise<Purchase> => {
  const response = await api.post(`/purchases/${reservationId}`, {
    userId: userId || 1,
  });
  return response.data;
};
