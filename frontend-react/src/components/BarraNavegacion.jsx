
import { useState } from 'react'
import { useAuth } from '../auth/useAuth'

function BarraNavegacion({
  vistaActual,
  cambiarVista,
  alSalir
}) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const { autenticado, usuario } = useAuth()

  const secciones = [
    { id: 'inicio', nombre: 'Inicio' },
    { id: 'torneos', nombre: 'Torneos' },
    { id: 'juegos', nombre: 'Juegos' },
    { id: 'equipos', nombre: 'Equipos' }
  ]
  if (autenticado) {
    secciones.push(
      { id: 'inscripcion', nombre: 'Inscripción' },
      { id: 'perfil', nombre: 'Perfil' }
  )

  if (
    usuario?.rol === 'ADMIN' ||
    usuario?.rol === 'ORGANIZADOR'
  ) {
    secciones.push({
      id: 'organizador',
      nombre: 'Organizador'
    })
  }

  if (usuario?.rol === 'ADMIN') {
    secciones.push({
      id: 'administracion',
      nombre: 'Administración'
    })
  }

  } else {
    secciones.push({
      id: 'login',
      nombre: 'Iniciar sesión'
    })
  }

  function navegar(seccion) {
    cambiarVista(seccion)
    setMenuAbierto(false)
  }

  function salir() {
  const confirmar = window.confirm(
    '¿Estás seguro de que quieres cerrar sesión?'
  )

  if (!confirmar) {
    return
  }

  alSalir()
  setMenuAbierto(false)
}

  return (
    <nav
      className="navbar navbar-dark bg-dark border-bottom border-secondary"
      aria-label="Navegación principal"
    >
      <div className="container-fluid px-3 px-lg-4 py-2">
        <div className="w-100">

          <div className="d-flex justify-content-between align-items-center">

            <h1 className="h5 text-white mb-0">
              eSports Arena Manager
            </h1>

            <button
              type="button"
              className="btn btn-outline-light btn-sm d-lg-none"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-expanded={menuAbierto}
              aria-controls="menuMovil"
            >
              {menuAbierto ? 'Cerrar menú' : '☰ Menú'}
            </button>

          </div>

          {autenticado && (
            <div className="d-flex align-items-center gap-3 mt-3">
              <span className="text-white-50 small">
                {usuario?.username} ({usuario?.rol})
              </span>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={salir}
              >
                Cerrar sesión
              </button>
            </div>
          )}

          <div className="d-none d-lg-flex flex-wrap gap-2 mt-3">
            {secciones.map((seccion) => (
              <button
                key={seccion.id}
                type="button"
                className={
                  vistaActual === seccion.id
                    ? 'btn btn-primary btn-sm'
                    : 'btn btn-outline-light btn-sm'
                }
                onClick={() => navegar(seccion.id)}
                aria-current={
                  vistaActual === seccion.id
                    ? 'page'
                    : undefined
                }
              >
                {seccion.nombre}
              </button>
            ))}
          </div>

          <div
            id="menuMovil"
            className={`d-lg-none flex-column gap-2 mt-3 ${
              menuAbierto ? 'd-flex' : 'd-none'
            }`}
          >
            {secciones.map((seccion) => (
              <button
                key={seccion.id}
                type="button"
                className={
                  vistaActual === seccion.id
                    ? 'btn btn-primary text-start w-100'
                    : 'btn btn-outline-light text-start w-100'
                }
                onClick={() => navegar(seccion.id)}
                aria-current={
                  vistaActual === seccion.id
                    ? 'page'
                    : undefined
                }
              >
                {seccion.nombre}
              </button>
            ))}
          </div>

        </div>
      </div>
    </nav>
  )
}

export default BarraNavegacion
