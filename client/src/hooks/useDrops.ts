import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { socket } from '../libs/socket';
import { getDrops } from '../api/drops';
import type { Drop } from '../types/api';

export const useDrops = () => {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await getDrops();
        setDrops(data);
      } catch {
        toast.error('Sync Error: Could not fetch latest drops.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Socket logic
    socket.on(
      'stock_update',
      (update: { dropId: number; availableStock: number }) => {
        setDrops((current) =>
          current.map((d) =>
            d.id === update.dropId
              ? { ...d, availableStock: update.availableStock }
              : d,
          ),
        );
      },
    );

    return () => {
      socket.off('stock_update');
    };
  }, []);

  return { drops, loading };
};
