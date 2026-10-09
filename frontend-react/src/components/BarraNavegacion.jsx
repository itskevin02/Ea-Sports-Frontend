
function BarraNavegacion({ vistaActual, cambiarVista }) {
  const secciones = [
    { id: 'inicio', nombre: 'Inicio' },
    { id: 'torneos', nombre: 'Torneos' },
    { id: 'detalle', nombre: 'Detalle torneo' },
    { id: 'inscripcion', nombre: 'Inscripción' },
    { id: 'equipos', nombre: 'Equipos' },
    { id: 'perfil', nombre: 'Perfil' },
    { id: 'administracion', nombre: 'Administración' }
  ]

  return (
    <nav className="navbar navbar-dark bg-dark border-bottom border-secondary">
      <div className="container py-2">
        <div className="w-100">
          <h1 className="h4 text-white mb-3">
            eSports Arena Manager
          </h1>

          <div className="d-flex flex-wrap gap-2">
            {secciones.map((seccion) => (
              <button
                key={seccion.id}
                type="button"
                className={
                  vistaActual === seccion.id
                    ? 'btn btn-primary btn-sm'
                    : 'btn btn-outline-light btn-sm'
                }
                onClick={() => cambiarVista(seccion.id)}
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
