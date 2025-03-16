import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import "@fontsource/montserrat"; // Defaults to 400 weight
import App from './App'

  
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
