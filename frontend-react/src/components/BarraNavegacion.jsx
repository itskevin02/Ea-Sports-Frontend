
import { useState } from 'react'

function BarraNavegacion({ vistaActual, cambiarVista }) {

  const [menuAbierto, setMenuAbierto] = useState(false)

  const secciones = [
    { id: 'inicio', nombre: 'Inicio' },
    { id: 'torneos', nombre: 'Torneos' },
    { id: 'detalle', nombre: 'Detalle torneo' },
    { id: 'inscripcion', nombre: 'Inscripción' },
    { id: 'equipos', nombre: 'Equipos' },
    { id: 'perfil', nombre: 'Perfil' },
    { id: 'administracion', nombre: 'Administración' }
  ]

  // Cambiar de pantalla y cerrar el menú móvil
  function navegar(seccion) {
    cambiarVista(seccion)
    setMenuAbierto(false)
  }

  return (
    <nav
      className="navbar navbar-dark bg-dark border-bottom border-secondary"
      aria-label="Navegación principal"
    >
      <div className="container py-2">

        <div className="w-100">

          {/* TÍTULO Y BOTÓN MÓVIL */}
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

          {/* MENÚ PARA COMPUTADORES */}
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

          {/* MENÚ PARA CELULARES Y TABLETS */}
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
