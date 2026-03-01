import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { Drop, Purchase } from '../types/api';
import { reserveDrop, purchaseDrop } from '../api/drops';

type StoredReservation = {
  reservationId: number;
  expiresAt: number;
};

export const DropCard = ({ drop }: { drop: Drop }) => {
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const storageKey = `reservation:${drop.id}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed: StoredReservation = JSON.parse(stored);
      if (Date.now() < parsed.expiresAt) {
        setReservationId(parsed.reservationId); // TODO: Fix cascading renders later
        setExpiresAt(parsed.expiresAt);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remainingMs = expiresAt - Date.now();
      const seconds = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeLeft(seconds);

      if (remainingMs <= 0) {
        clearInterval(interval);
        localStorage.removeItem(storageKey);
        setReservationId(null);
        setExpiresAt(null);
        toast.error('Reservation expired');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, storageKey]);

  const handleReserve = async (dropId: number) => {
    try {
      const result = await reserveDrop(dropId);
      const expiry = Date.now() + 60_000;
      localStorage.setItem(
        `reservation:${dropId}`,
        JSON.stringify({
          reservationId: result.id,
          expiresAt: expiry,
        }),
      );
      setReservationId(result.id);
      setExpiresAt(expiry);
      toast.success('Drop reserved for 1 min');
    } catch {
      toast.error('Failed to reserve drop');
    }
  };

  const handlePurchase = async (reservationId: number) => {
    try {
      await purchaseDrop(reservationId);
      localStorage.removeItem(`reservation:${drop.id}`);
      setReservationId(null);
      setExpiresAt(null);
      toast.success('Drop purchase success');
    } catch {
      toast.error('Failed to purchase drop');
    }
  };

  const isReserved = Boolean(reservationId);

  return (
    <div className='border p-4 rounded shadow'>
      <h2 className='text-xl font-bold'>{drop.name}</h2>
      <p>
        Stock: {drop.availableStock} / {drop.totalStock}
      </p>

      <button
        onClick={() => handleReserve(drop.id)}
        className='bg-blue-500 text-white p-2 mt-2 rounded disabled:bg-gray-400'
        disabled={drop.availableStock === 0 || Boolean(reservationId)}
      >
        {drop.availableStock > 0 ? 'Reserve' : 'Sold Out'}
      </button>

      {isReserved && (
        <div className='mt-2'>
          <p className='text-sm text-gray-600'>
            Reservation expires in: {timeLeft}s
          </p>

          <button
            onClick={() => handlePurchase(reservationId!)}
            className='bg-green-500 text-white p-2 mt-2 rounded'
          >
            Purchase
          </button>
        </div>
      )}

      {/* Activity Feed Section */}
      <div className='mt-4 border-t pt-2'>
        <h3 className='font-semibold text-sm'>Recent Purchasers:</h3>
        <ul className='text-xs text-gray-600'>
          {drop.Purchases.map((purchase: Purchase) => (
            <li key={purchase.id}>
              {purchase.User?.username} -{' '}
              {new Date(purchase.purchasedAt).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
