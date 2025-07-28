import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import GridCanvas from "./components/Canvas/GridCanvas.jsx";
import ParticleCanvas from "./components/Canvas/ParticleCanvas.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <ParticleCanvas />
        <App />
    </BrowserRouter>
  </StrictMode>,
)
