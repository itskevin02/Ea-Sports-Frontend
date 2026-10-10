
import { useState } from 'react'

import BarraNavegacion from './components/BarraNavegacion'

// Pantallas de Martín
import { Inicio } from './pages/Inicio'
import { Torneos } from './pages/Torneos'
import DetalleTorneo from './pages/DetalleTorneo'

// Pantallas de Kevin
import Perfil from './pages/Perfil'
import Administracion from './pages/Administracion'

// Pantallas de Agustín
import Equipos from './pages/Equipos'
import Inscripcion from './pages/Inscripcion'

import './App.css'

function App() {
  const [vistaActual, setVistaActual] = useState('inicio')
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null)

  function mostrarDetalle(torneo) {
    setTorneoSeleccionado(torneo)
    setVistaActual('detalle')
  }

  function volverATorneos() {
    setVistaActual('torneos')
  }

  return (
    <div className="min-vh-100 bg-dark text-white">

      <BarraNavegacion
        vistaActual={vistaActual}
        cambiarVista={setVistaActual}
      />

      <main className="container py-4">

        {vistaActual === 'inicio' ? (
          <Inicio
            onNavegar={setVistaActual}
            onVerDetalle={mostrarDetalle}
          />

        ) : vistaActual === 'torneos' ? (
          <Torneos onVerDetalle={mostrarDetalle} />

        ) : vistaActual === 'detalle' ? (
          <DetalleTorneo
            torneo={torneoSeleccionado}
            onVolver={volverATorneos}
          />

        ) : vistaActual === 'inscripcion' ? (
          <Inscripcion />

        ) : vistaActual === 'equipos' ? (
          <Equipos />

        ) : vistaActual === 'perfil' ? (
          <Perfil />

        ) : vistaActual === 'administracion' ? (
          <Administracion />

        ) : (
          <div className="card">
            <div className="card-body">
              <h2 className="h4">
                Página no encontrada
              </h2>
            </div>
          </div>
        )}

      </main>

    </div>
  )
}

export default App
