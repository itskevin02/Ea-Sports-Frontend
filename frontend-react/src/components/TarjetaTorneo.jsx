
import { obtenerInscritosActuales } from '../logica/contarInscripciones'

export const TarjetaTorneo = ({ torneo, onVerDetalle }) => {

  const totalInscritos = obtenerInscritosActuales(torneo)

  return (
    <div className="col-md-4 mb-4">

      <div className="card h-100 shadow-sm border-0">

        <img
          src={torneo.imagen}
          className="card-img-top"
          alt={torneo.nombre}
          style={{
            height: '180px',
            width: '100%',
            objectFit: 'cover'
          }}
        />

        <div className="card-body d-flex flex-column">

          <span
            className={`badge ${
              torneo.estado === 'Abierto'
                ? 'bg-success'
                : 'bg-secondary'
            } w-auto ms-auto mb-2`}
          >
            {torneo.estado}
          </span>

          <h5 className="card-title fw-bold">
            {torneo.nombre}
          </h5>

          <p className="card-text text-muted mb-1">
            Juego: {torneo.juego}
          </p>

          <p className="card-text text-muted mb-2">
            Plataforma: {torneo.plataforma}
          </p>

          <p className="card-text small text-secondary flex-grow-1">
            {torneo.descripcion}
          </p>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">

            <small className="text-muted">
              Cupos: {totalInscritos}/{torneo.cupos}
            </small>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                if (onVerDetalle) {
                  onVerDetalle(torneo)
                }
              }}
            >
              Ver Detalle
            </button>

          </div>

        </div>
      </div>

    </div>
  )
}
