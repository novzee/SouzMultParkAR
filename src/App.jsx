import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ARScene from './pages/ARScene';
import ARPhoto from './pages/ARPhoto';
import Minigames from './pages/Minigames';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ar-scene/:character" element={<ARScene />} />
      <Route path="/ar-photo" element={<ARPhoto />} />
      <Route path="/minigames" element={<Minigames />} />
    </Routes>
  );
}

export default App;
