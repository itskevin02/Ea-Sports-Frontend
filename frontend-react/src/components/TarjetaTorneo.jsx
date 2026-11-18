
import { obtenerInscritosActuales } from '../logica/contarInscripciones'

function obtenerFechaActual() {
  const fecha = new Date()

  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

export const TarjetaTorneo = ({ torneo, onVerDetalle }) => {

  const esBackend = torneo.cantidadEquipos !== undefined

  const totalInscritos = esBackend
    ? null
    : obtenerInscritosActuales(torneo)

  const cuposDisponibles = esBackend
    ? null
    : Math.max(0, torneo.cupos - totalInscritos)

  const estado = torneo.estado.toLowerCase()

  let disponibilidad = 'Disponible'
  let colorDisponibilidad = 'text-success'

  if (estado !== 'abierto') {
    disponibilidad = 'Inscripciones cerradas'
    colorDisponibilidad = 'text-secondary'

  } else if (
    torneo.fechaCierre &&
    obtenerFechaActual() > torneo.fechaCierre
  ) {
    disponibilidad = 'Plazo finalizado'
    colorDisponibilidad = 'text-danger'

  } else if (!esBackend && cuposDisponibles === 0) {
    disponibilidad = 'Sin cupos'
    colorDisponibilidad = 'text-danger'
  }

  const juego = torneo.juego ||
    (torneo.juegoId
      ? `ID ${torneo.juegoId}`
      : 'No especificado')

  return (
    <div className="col-12 col-md-6 col-xl-4 mb-4">

      <div className="card h-100 shadow-sm border-0">

        {/* IMAGEN DEL TORNEO */}
        {torneo.imagen ? (
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
        ) : (
          <div
            className="bg-secondary text-white d-flex align-items-center justify-content-center"
            style={{ height: '180px' }}
          >
            Imagen no disponible
          </div>
        )}

        <div className="card-body d-flex flex-column">

          {/* ESTADO DEL TORNEO */}
          <span
            className={`badge ${
              estado === 'abierto'
                ? 'bg-success'
                : estado === 'en curso'
                  ? 'bg-primary'
                  : 'bg-secondary'
            } w-auto ms-auto mb-2`}
          >
            {torneo.estado}
          </span>

          {/* NOMBRE */}
          <h5 className="card-title fw-bold">
            {torneo.nombre}
          </h5>

          {/* JUEGO */}
          <p className="card-text text-muted mb-1">
            Juego: {juego}
          </p>

          {/* PLATAFORMA */}
          <p className="card-text text-muted mb-2">
            Plataforma: {torneo.plataforma}
          </p>

          {/* DESCRIPCION */}
          <p className="card-text small text-secondary flex-grow-1">
            {torneo.descripcion}
          </p>

          {/* INFORMACION DEL TORNEO */}
          {esBackend ? (
            <p className="text-secondary small mb-2">
              Ubicación: {torneo.ubicacion}
            </p>
          ) : (
            <p className={`${colorDisponibilidad} fw-semibold small mb-2`}>
              Inscripciones: {disponibilidad}
            </p>
          )}

          {/* FECHA DE CIERRE */}
          {torneo.fechaCierre && (
            <p className="text-secondary small mb-2">
              Cierre de inscripción: {torneo.fechaCierre}
            </p>
          )}

          {/* EQUIPOS Y DETALLE */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">

            {esBackend ? (
              <small className="text-muted">
                Equipos permitidos: {torneo.cantidadEquipos}
              </small>
            ) : (
              <small className="text-muted">
                Cupos: {totalInscritos}/{torneo.cupos}
              </small>
            )}

            {/* BOTON VER DETALLE */}
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
