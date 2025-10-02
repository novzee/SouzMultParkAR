import { render } from 'react-dom'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

//import './index.css'

import DemosMenu from './js/components/DemosMenu'

import DemoSprite from './js/demos/Sprite.jsx'
import DemoARCoffee from './js/demos/ARCoffee.jsx'
import DemoKeyboard from './js/demos/Keyboard.jsx'
import DemoCoin from './js/demos/Coin.jsx'
import Object3DPopmart from './js/demos/Object3DPopmart'
import TestDetection from './js/demos/TestDetection'
import ModelComparison from './js/demos/ModelComparison'


export default function App(props){
  return (
    <Router>
      <Routes>
        <Route path="/sprite" element={<DemoSprite />} />
        <Route path="/ARCoffee" element={<DemoARCoffee />} />
        <Route path="/keyboard" element={<DemoKeyboard />} />
        <Route path="/coin" element={<DemoCoin />} />
        <Route path="/popmart" element={<Object3DPopmart />} />
        <Route path="/test" element={<TestDetection />} />
        <Route path="/compare" element={<ModelComparison />} />
        <Route path="/" element={<DemosMenu />} />
      </Routes>
    </Router>
  )
}