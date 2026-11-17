
import { useState } from 'react'

import { useAuth } from './auth/useAuth'
import BarraNavegacion from './components/BarraNavegacion'

import { Inicio } from './pages/Inicio'
import { Torneos } from './pages/Torneos'
import DetalleTorneo from './pages/DetalleTorneo'

import Perfil from './pages/Perfil'
import Administracion from './pages/Administracion'
import Equipos from './pages/Equipos'
import Inscripcion from './pages/Inscripcion'
import Juegos from './pages/Juegos'
import Login from './pages/Login'

import './App.css'

function App() {
  const { autenticado, usuario, logout } = useAuth()

  const [vistaActual, setVistaActual] = useState('inicio')
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null)

  const vistasProtegidas = [
    'inscripcion',
    'equipos',
    'perfil',
    'administracion'
  ]

  function cambiarVista(vista) {
    if (!autenticado && vistasProtegidas.includes(vista)) {
      setVistaActual('login')
      return
    }

    if (vista === 'administracion' && usuario?.rol !== 'ADMIN') {
      setVistaActual('sin-permiso')
      return
    }

    if (vista === 'detalle' && !torneoSeleccionado) {
      setVistaActual('torneos')
      return
    }

    setVistaActual(vista)
  }

  function mostrarDetalle(torneo) {
    setTorneoSeleccionado(torneo)
    setVistaActual('detalle')
  }

  function volverATorneos() {
    setVistaActual('torneos')
  }

  function alEntrar(usuarioIngresado) {
    if (usuarioIngresado?.rol === 'ADMIN') {
      setVistaActual('administracion')
    } else {
      setVistaActual('perfil')
    }
  }

  function alSalir() {
    logout()
    setVistaActual('inicio')
  }

  return (
    <div className="min-vh-100 bg-dark text-white">

      <BarraNavegacion
        vistaActual={vistaActual}
        cambiarVista={cambiarVista}
        alSalir={alSalir}
      />

      <main className="container-fluid px-3 px-lg-4 py-4">

        {!autenticado && (
          vistaActual === 'login' ||
          vistasProtegidas.includes(vistaActual)
        ) ? (
          <Login onLogin={alEntrar} />

        ) : vistaActual === 'sin-permiso' ||
            (vistaActual === 'administracion' &&
             usuario?.rol !== 'ADMIN') ? (
          <div className="alert alert-warning">
            No tienes permiso para acceder a esta sección.
          </div>

        ) : vistaActual === 'inicio' ? (
          <Inicio
            onNavegar={cambiarVista}
            onVerDetalle={mostrarDetalle}
            esAdmin={usuario?.rol === 'ADMIN'}
          />
        ) : vistaActual === 'torneos' ? (
          <Torneos onVerDetalle={mostrarDetalle} />

        ) : vistaActual === 'juegos' ? (
          <Juegos />

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

        ) : vistaActual === 'login' ? (
          <div className="alert alert-info">
            Ya tienes una sesión iniciada.
          </div>

        ) : (
          <div className="alert alert-warning">
            Página no encontrada.
          </div>
        )}

      </main>

    </div>
  )
}

export default App
