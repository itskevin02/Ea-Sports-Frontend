
function DetalleTorneo({ torneo, onVolver }) {
  if (!torneo) {
    return (
      <div className="card">
        <div className="card-body">
          <h2 className="h4">Torneo no encontrado</h2>

          <button
            className="btn btn-primary mt-3"
            onClick={onVolver}
          >
            Volver a Torneos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Detalle del Torneo</h2>

      <div className="card">
        <div className="card-body">

          <h3 className="h4 mb-3">
            {torneo.nombre}
          </h3>

          <p>
            <strong>Juego:</strong> {torneo.juego}
          </p>

          <p>
            <strong>Plataforma:</strong> {torneo.plataforma}
          </p>

          <p>
            <strong>Fecha de inicio:</strong> {torneo.fechaInicio}
          </p>

          <p>
            <strong>Estado:</strong>{' '}
            <span
              className={`badge ${
                torneo.estado === 'Abierto'
                  ? 'bg-success'
                  : 'bg-secondary'
              }`}
            >
              {torneo.estado}
            </span>
          </p>

          <p>
            <strong>Inscritos:</strong>{' '}
            {torneo.inscritos} de {torneo.cupos}
          </p>

          <p>
            <strong>Descripción:</strong>
          </p>

          <p className="text-secondary">
            {torneo.descripcion}
          </p>

          <button
            type="button"
            className="btn btn-outline-primary mt-3"
            onClick={onVolver}
          >
            Volver a Torneos
          </button>

        </div>
      </div>
    </div>
  )
}

export default DetalleTorneo
