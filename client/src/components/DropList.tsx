import { DropCard } from './DropCard';
import { useDrops } from '../hooks/useDrops';

export const DropList = () => {
  const { drops, loading } = useDrops();

  if (loading) {
    return (
      <div className='text-center py-10 font-mono text-xl'>
        Loading Drops...
      </div>
    );
  }

  return (
    <div>
      {drops.map((drop) => (
        <DropCard key={drop.id} drop={drop} />
      ))}
    </div>
  );
};
