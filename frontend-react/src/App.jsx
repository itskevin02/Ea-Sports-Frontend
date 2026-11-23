import { useState } from 'react'

import { useAuth } from './auth/useAuth'
import BarraNavegacion from './components/BarraNavegacion'

import { Inicio } from './pages/Inicio'
import { Torneos } from './pages/Torneos'
import DetalleTorneo from './pages/DetalleTorneo'

import Perfil from './pages/Perfil'
import Administracion from './pages/Administracion'
import Organizador from './pages/Organizador'
import Equipos from './pages/Equipos'
import Inscripcion from './pages/Inscripcion'
import Juegos from './pages/Juegos'
import Login from './pages/Login'
import DetalleTorneoApi from './pages/DetalleTorneoApi'

import './App.css'

function App() {

  const { autenticado, usuario, logout } = useAuth()

  const [vistaActual, setVistaActual] = useState('inicio')
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null)

  // Vistas que requieren iniciar sesión
  const vistasProtegidas = [
    'inscripcion',
    'perfil',
    'organizador',
    'administracion'
  ]

  // Permisos del panel Organizador
  const puedeOrganizar =
    usuario?.rol === 'ADMIN' ||
    usuario?.rol === 'ORGANIZADOR'

  function cambiarVista(vista) {

    // Comprobar que exista una sesión
    if (!autenticado && vistasProtegidas.includes(vista)) {
      setVistaActual('login')
      return
    }

    // Solo el administrador puede administrar
    if (
      vista === 'administracion' &&
      usuario?.rol !== 'ADMIN'
    ) {
      setVistaActual('sin-permiso')
      return
    }

    // Solo ADMIN y ORGANIZADOR pueden organizar
    if (
      vista === 'organizador' &&
      !puedeOrganizar
    ) {
      setVistaActual('sin-permiso')
      return
    }

    // Evitar abrir un torneo sin seleccionarlo
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

    } else if (usuarioIngresado?.rol === 'ORGANIZADOR') {
      setVistaActual('organizador')

    } else {
      setVistaActual('perfil')
    }
  }

  function alSalir() {
    logout()
    setVistaActual('inicio')
    setTorneoSeleccionado(null)
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

            (
              vistaActual === 'administracion' &&
              usuario?.rol !== 'ADMIN'
            ) ||

            (
              vistaActual === 'organizador' &&
              !puedeOrganizar
            ) ? (

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

          torneoSeleccionado?.cantidadEquipos !== undefined ? (

            <DetalleTorneoApi
              torneoId={torneoSeleccionado.id}
              onVolver={volverATorneos}
            />

          ) : (

            <DetalleTorneo
              torneo={torneoSeleccionado}
              onVolver={volverATorneos}
            />

          )

        ) : vistaActual === 'inscripcion' ? (

          <Inscripcion />

        ) : vistaActual === 'equipos' ? (

          <Equipos />

        ) : vistaActual === 'perfil' ? (

          <Perfil />

        ) : vistaActual === 'organizador' ? (

          <Organizador />

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
