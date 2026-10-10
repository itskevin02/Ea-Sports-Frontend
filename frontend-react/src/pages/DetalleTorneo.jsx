
import { obtenerInscritosActuales } from '../logica/contarInscripciones'

import TablaRanking from '../components/TablaRanking'
import LlaveTorneo from '../components/LlaveTorneo'
import ListaPartidas from '../components/ListaPartidas'

function DetalleTorneo({
  torneo,
  onVolver,
  participantes = [],
  partidas = []
}) {

  // Si no existe un torneo seleccionado
  if (!torneo) {
    return (
      <div className="card">
        <div className="card-body">

          <h2 className="h4">
            Torneo no encontrado
          </h2>

          <p className="text-secondary">
            No se encontró la información del torneo.
          </p>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={onVolver}
          >
            Volver a Torneos
          </button>

        </div>
      </div>
    )
  }

  // Contar inscritos iniciales y nuevas inscripciones
  const totalInscritos = obtenerInscritosActuales(torneo)

  const disponibles = Math.max(
    0,
    torneo.cupos - totalInscritos
  )

  // Estados en los que ya puede existir una clasificación
  const torneoIniciado =
    torneo.estado === 'En curso' ||
    torneo.estado === 'Finalizado'

  // No mostrar resultados antes de comenzar el torneo
  const rankingVisible = torneoIniciado
    ? participantes
    : []

  const partidasVisibles = torneoIniciado
    ? partidas
    : []

  return (
    <div>

      <h2 className="mb-4">
        Detalle del Torneo
      </h2>

      {/* INFORMACIÓN GENERAL */}
      <div className="card mb-4">

        <div className="card-body">

          <div className="row g-4 align-items-center">

            {/* IMAGEN DEL VIDEOJUEGO */}
            <div className="col-12 col-md-5">

              <img
                src={torneo.imagen}
                alt={torneo.nombre}
                className="img-fluid rounded"
                style={{
                  width: '100%',
                  height: '230px',
                  objectFit: 'cover'
                }}
              />

            </div>

            {/* DATOS DEL TORNEO */}
            <div className="col-12 col-md-7">

              <h3 className="h4 mb-3">
                {torneo.nombre}
              </h3>

              <p>
                <strong>Juego:</strong>{' '}
                {torneo.juego}
              </p>

              <p>
                <strong>Plataforma:</strong>{' '}
                {torneo.plataforma}
              </p>

              <p>
                <strong>Fecha de inicio:</strong>{' '}
                {torneo.fechaInicio}
              </p>

              <p>
                <strong>Cierre de inscripción:</strong>{' '}
                {torneo.fechaCierre}
              </p>

              <p>
                <strong>Estado:</strong>{' '}

                <span
                  className={`badge ${
                    torneo.estado === 'Abierto'
                      ? 'bg-success'
                      : torneo.estado === 'En curso'
                        ? 'bg-primary'
                        : 'bg-secondary'
                  }`}
                >
                  {torneo.estado}
                </span>
              </p>

              <p>
                <strong>Participantes inscritos:</strong>{' '}
                {totalInscritos} de {torneo.cupos}
              </p>

              <p>
                <strong>Cupos disponibles:</strong>{' '}
                {disponibles}
              </p>

            </div>

          </div>

          <hr />

          {/* DESCRIPCIÓN */}
          <h4 className="h5">
            Descripción
          </h4>

          <p className="text-secondary mb-0">
            {torneo.descripcion}
          </p>

        </div>

      </div>

      {/* MENSAJE SEGÚN ESTADO DEL TORNEO */}
      {torneo.estado === 'Abierto' && (
        <div className="alert alert-info mb-4">

          <h3 className="h6">
            Torneo abierto para inscripciones
          </h3>

          <p className="mb-0">
            La competencia todavía no ha comenzado.
            La tabla de posiciones y los enfrentamientos
            estarán disponibles cuando se registren
            los resultados y se programen las partidas.
          </p>

        </div>
      )}

      {torneo.estado === 'Cerrado' && (
        <div className="alert alert-secondary mb-4">

          <h3 className="h6">
            Inscripciones cerradas
          </h3>

          <p className="mb-0">
            Este torneo no recibe nuevas inscripciones.
            La clasificación estará disponible cuando
            comience la competencia y existan resultados.
          </p>

        </div>
      )}

      {torneo.estado === 'En curso' && (
        <div className="alert alert-info mb-4">

          <h3 className="h6">
            Torneo en curso
          </h3>

          <p className="mb-0">
            La competencia está en desarrollo.
            Los resultados se mostrarán cuando
            estén disponibles.
          </p>

        </div>
      )}

      {torneo.estado === 'Finalizado' && (
        <div className="alert alert-success mb-4">

          <h3 className="h6">
            Torneo finalizado
          </h3>

          <p className="mb-0">
            La competencia ha terminado.
            La clasificación final se mostrará
            cuando sus resultados estén registrados.
          </p>

        </div>
      )}

      {/* TABLA DE POSICIONES */}
      <div className="mb-4">

        <TablaRanking
          participantes={rankingVisible}
        />

      </div>

     {/* LLAVES Y ENFRENTAMIENTOS */}
<div className="mb-4">

  <LlaveTorneo
    partidas={partidasVisibles}
  />

</div>

{/* CALENDARIO DE PARTIDAS */}
<div className="mb-4">

  <ListaPartidas
    partidas={partidasVisibles}
  />

</div>

      {/* VOLVER AL LISTADO */}
      <div className="text-center">

        <button
          type="button"
          className="btn btn-outline-primary px-4"
          onClick={onVolver}
        >
          Volver a Torneos
        </button>

      </div>

    </div>
  )
}

export default DetalleTorneo
