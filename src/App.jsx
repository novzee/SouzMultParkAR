import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded page components
const Home = lazy(() => import('./pages/Home'));
const ARPhoto = lazy(() => import('./pages/ARPhoto'));
const Minigames = lazy(() => import('./pages/Minigames'));
const ARShapok = lazy(() => import('./pages/ARShapok'));
const ARGena = lazy(() => import('./pages/ARGena'));
const ARPogod = lazy(() => import('./pages/ARPogod'));
const GenaInfo = lazy(() => import('./pages/GenaInfo'));
const ShapoklyakInfo = lazy(() => import('./pages/ShapoklyakInfo'));
const TicketPage = lazy(() => import('./pages/TicketPage'));
const WolfAndEggs = lazy(() => import('./pages/WolfAndEggs'));

function App() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
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
    </Suspense>
  );
}

export default App;
