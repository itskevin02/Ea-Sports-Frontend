
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import App from './App.jsx'

import {
  inicializarDatosDemoSanciones
} from './data/datosDemoSanciones'

// Cargar registros de demostración una sola vez
// sin eliminar los registros existentes
inicializarDatosDemoSanciones()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
