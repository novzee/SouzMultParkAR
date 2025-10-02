import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ARPhoto from './pages/ARPhoto';
import Minigames from './pages/Minigames';
import ShapokRat from './pages/ShapokRat';
import ARGena from './pages/ARGena';
import ARShapok from './pages/ARShapok';
import ARPogod from './pages/ARPogod';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ar-photo" element={<ARPhoto />} />
      <Route path="/minigames" element={<Minigames />} />
      <Route path="/shapok" element={<ShapokRat />} />
      <Route path='/gena' element={<ARGena />} />
      <Route path="*" element={<Home />} />
      <Route path='shapka' element={<ARShapok />} />  
      <Route path='/nupogodi' element={<ARPogod />} />
    </Routes>
  );
}

export default App;
