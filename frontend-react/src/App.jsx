
import { useState } from 'react'

import BarraNavegacion from './components/BarraNavegacion'

import { Inicio } from './pages/Inicio'
import { Torneos } from './pages/Torneos'
import DetalleTorneo from './pages/DetalleTorneo'

import Perfil from './pages/Perfil'
import Administracion from './pages/Administracion'

import './App.css'

function App() {
  const [vistaActual, setVistaActual] = useState('inicio')
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null)

  const paginas = {
    inscripcion: 'Inscripción a torneos',
    equipos: 'Gestión de equipos'
  }

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

      <main className="container py-5">

        {vistaActual === 'inicio' ? (
          <>
            <Inicio />

            <p className="text-white-50 text-center">
              Plataforma de gestión de torneos,
              equipos y jugadores.
            </p>

            <div className="row g-3 mt-3">

              <div className="col-12 col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Torneos</h3>
                    <p>Consulta los torneos disponibles.</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setVistaActual('torneos')}
                    >
                      Ver torneos
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Equipos</h3>
                    <p>Gestiona equipos y jugadores.</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setVistaActual('equipos')}
                    >
                      Ver equipos
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">Administración</h3>
                    <p>Administra los registros del sistema.</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        setVistaActual('administracion')
                      }
                    >
                      Administrar
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : vistaActual === 'torneos' ? (
          <Torneos onVerDetalle={mostrarDetalle} />
        ) : vistaActual === 'detalle' ? (
          <DetalleTorneo
            torneo={torneoSeleccionado}
            onVolver={volverATorneos}
          />
        ) : vistaActual === 'perfil' ? (
          <Perfil />
        ) : vistaActual === 'administracion' ? (
          <Administracion />
        ) : (
          <div className="card">
            <div className="card-body">
              <h2 className="h4">{paginas[vistaActual]}</h2>
              <p className="text-secondary mb-0">
                Esta sección se incorporará durante
                la integración de la EP2.
              </p>
            </div>
          </div>
        )}

      </main>

    </div>
  )
}

export default App
