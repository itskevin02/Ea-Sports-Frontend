
import { obtenerInscritosActuales } from '../logica/contarInscripciones'
import { obtenerParticipantes } from '../data/participantes'

import TablaRanking from '../components/TablaRanking'
import LlaveTorneo from '../components/LlaveTorneo'
import ListaPartidas from '../components/ListaPartidas'
import ListaParticipantes from '../components/ListaParticipantes'

// Obtener inscripciones nuevas guardadas en el navegador
function cargarParticipantesLocales(torneoId) {
  try {
    const datos = localStorage.getItem(
      'esports_inscripciones_ep2'
    )

    if (datos) {
      const inscripciones = JSON.parse(datos)

      if (Array.isArray(inscripciones)) {
        return inscripciones
          .filter(
            (inscripcion) =>
              Number(inscripcion.torneoId) === Number(torneoId)
          )
          .map((inscripcion) => ({
            id: `local-${inscripcion.id}`,
            nombre: inscripcion.participante,
            tipo: inscripcion.tipo
          }))
      }
    }
  } catch {
    return []
  }

  return []
}

function DetalleTorneo({
  torneo,
  onVolver,
  participantes = [],
  partidas = []
}) {

  // Comprobar que exista un torneo
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

  // Obtener participantes de nuestra base de datos simulada
  const participantesIniciales = obtenerParticipantes(
    Number(torneo.id)
  )

  // Obtener participantes registrados desde el formulario
  const participantesLocales = cargarParticipantesLocales(
    torneo.id
  )

  // Reunir ambos listados sin modificar los cupos
  const participantesInscritos = [
    ...participantesIniciales,
    ...participantesLocales
  ]

  // El ranking solamente se muestra si el torneo comenzó
  const torneoIniciado =
    torneo.estado === 'En curso' ||
    torneo.estado === 'Finalizado'

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

            {/* IMAGEN DEL TORNEO */}
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

      {/* MENSAJES SEGÚN ESTADO */}
      {torneo.estado === 'Abierto' && (
        <div className="alert alert-info mb-4">

          <h3 className="h6">
            Torneo abierto para inscripciones
          </h3>

          <p className="mb-0">
            La competencia todavía no ha comenzado.
            Los participantes podrán consultarse cuando
            se cierren las inscripciones.
            La clasificación estará disponible cuando
            se registren resultados.
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
            Ya puedes consultar los participantes registrados.
            Los resultados estarán disponibles cuando
            comience la competencia.
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
            Puedes consultar los participantes
            y los resultados disponibles.
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
            Los participantes y la clasificación final
            estarán disponibles si existen
            resultados registrados.
          </p>

        </div>
      )}

      {/* PARTICIPANTES INSCRITOS */}
      <ListaParticipantes
        estado={torneo.estado}
        participantes={participantesInscritos}
        totalInscritos={totalInscritos}
      />

      {/* TABLA DE POSICIONES */}
      <div className="mb-4">

        <TablaRanking
          participantes={rankingVisible}
        />

      </div>

      {/* LLAVES DEL TORNEO */}
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
