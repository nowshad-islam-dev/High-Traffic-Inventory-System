import { Toaster } from 'react-hot-toast';
import { DropList } from './components/DropList';

function App() {
  return (
    <>
      <h1 className='bg-slate-200 text-center text-3xl font-bold'>
        Welcome to Sneaker Drop
      </h1>
      <DropList />
      <Toaster />
    </>
  );
}

export default App;
