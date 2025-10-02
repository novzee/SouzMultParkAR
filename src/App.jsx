import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ARPhoto from './pages/ARPhoto';
import Minigames from './pages/Minigames';
import ARShapok from './pages/ARShapok';
import ARGena from './pages/ARGena';
import ARPogod from './pages/ARPogod';
import GenaInfo from './pages/GenaInfo';
import ShapoklyakInfo from './pages/ShapoklyakInfo';
import TicketPage from './pages/TicketPage';
import WolfAndEggs from './pages/WolfAndEggs';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ar-photo" element={<ARPhoto />} />
      <Route path="/minigames" element={<Minigames />} />
      <Route path="/shapka" element={<ARShapok />} />
      <Route path='/gena' element={<ARGena />} />
      <Route path='/nupogodi' element={<ARPogod />} />
      <Route path="/gena-info" element={<GenaInfo />} />
      <Route path="/shapok-info" element={<ShapoklyakInfo />} />
      <Route path="/ticket" element={<TicketPage />} />
      <Route path="/wolf-and-eggs" element={<WolfAndEggs />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
