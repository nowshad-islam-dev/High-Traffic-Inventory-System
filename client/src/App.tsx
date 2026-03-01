import { Toaster } from 'react-hot-toast';
import { DropList } from './components/DropList';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header />

      <DropList />
      <Toaster />
    </>
  );
}

export default App;
