
import { obtenerInscritosActuales } from '../logica/contarInscripciones'
import { obtenerParticipantes } from '../data/participantes'

import TablaRanking from '../components/TablaRanking'
import LlaveTorneo from '../components/LlaveTorneo'
import ListaPartidas from '../components/ListaPartidas'
import ListaParticipantes from '../components/ListaParticipantes'

// Obtener la fecha actual
function obtenerFechaActual() {
  const fecha = new Date()

  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

// Obtener inscripciones guardadas en el navegador
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

  // Validar que exista un torneo
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
            className="btn btn-primary"
            onClick={onVolver}
          >
            Volver a Torneos
          </button>

        </div>
      </div>
    )
  }

  // Calcular inscritos y cupos
  const totalInscritos = obtenerInscritosActuales(torneo)

  const disponibles = Math.max(
    0,
    torneo.cupos - totalInscritos
  )

  // Comprobar el plazo de inscripción
  const plazoFinalizado =
    torneo.fechaCierre &&
    obtenerFechaActual() > torneo.fechaCierre

  const sinCupos = disponibles === 0

  // Determinar si realmente recibe inscripciones
  const inscripcionesHabilitadas =
    torneo.estado === 'Abierto' &&
    !plazoFinalizado &&
    !sinCupos

  // Mostrar disponibilidad real
  let disponibilidad = 'Disponible'
  let colorDisponibilidad = 'text-success'

  if (torneo.estado !== 'Abierto') {

    disponibilidad = 'Inscripciones cerradas'
    colorDisponibilidad = 'text-secondary'

  } else if (plazoFinalizado) {

    disponibilidad = 'Plazo finalizado'
    colorDisponibilidad = 'text-danger'

  } else if (sinCupos) {

    disponibilidad = 'Sin cupos'
    colorDisponibilidad = 'text-danger'
  }

  // Participantes iniciales
  const participantesIniciales = obtenerParticipantes(
    Number(torneo.id)
  )

  // Participantes agregados desde el formulario
  const participantesLocales = cargarParticipantesLocales(
    torneo.id
  )

  const participantesInscritos = [
    ...participantesIniciales,
    ...participantesLocales
  ]

  // Mostrar resultados únicamente en torneos iniciados
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

            {/* IMAGEN */}
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

            {/* DATOS */}
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

              {/* NUEVO: DISPONIBILIDAD */}
              <p>
                <strong>Inscripciones:</strong>{' '}

                <span className={colorDisponibilidad}>
                  {disponibilidad}
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

          <h4 className="h5">
            Descripción
          </h4>

          <p className="text-secondary mb-0">
            {torneo.descripcion}
          </p>

        </div>
      </div>

      {/* TORNEO ABIERTO Y CON CUPOS */}
      {inscripcionesHabilitadas && (
        <div className="alert alert-info mb-4">

          <h3 className="h6">
            Torneo abierto para inscripciones
          </h3>

          <p className="mb-0">
            Este torneo todavía recibe participantes.
            Puedes realizar una inscripción si cumples
            los requisitos establecidos.

            El listado de participantes se mostrará
            cuando el torneo cambie al estado Cerrado.
          </p>

        </div>
      )}

      {/* NUEVO: PLAZO FINALIZADO */}
      {torneo.estado === 'Abierto' &&
        plazoFinalizado && (

        <div className="alert alert-warning mb-4">

          <h3 className="h6">
            Plazo de inscripción finalizado
          </h3>

          <p className="mb-0">
            La fecha límite para inscribirse ya pasó.

            Aunque el torneo todavía aparece registrado
            como Abierto, no se aceptan nuevas
            inscripciones.

            Los participantes se podrán consultar
            cuando el organizador cambie su estado
            a Cerrado.
          </p>

        </div>
      )}

      {/* NUEVO: TORNEO SIN CUPOS */}
      {torneo.estado === 'Abierto' &&
        !plazoFinalizado &&
        sinCupos && (

        <div className="alert alert-warning mb-4">

          <h3 className="h6">
            Torneo sin cupos disponibles
          </h3>

          <p className="mb-0">
            Se alcanzó la cantidad máxima de
            participantes permitidos.

            No es posible realizar nuevas
            inscripciones.

            El listado se mostrará cuando
            el torneo cambie al estado Cerrado.
          </p>

        </div>
      )}

      {/* TORNEO CERRADO */}
      {torneo.estado === 'Cerrado' && (

        <div className="alert alert-secondary mb-4">

          <h3 className="h6">
            Inscripciones cerradas
          </h3>

          <p className="mb-0">
            Este torneo no recibe nuevas inscripciones.

            Ya puedes consultar los participantes
            registrados.

            Los resultados estarán disponibles
            cuando comience la competencia.
          </p>

        </div>
      )}

      {/* TORNEO EN CURSO */}
      {torneo.estado === 'En curso' && (

        <div className="alert alert-info mb-4">

          <h3 className="h6">
            Torneo en curso
          </h3>

          <p className="mb-0">
            La competencia está en desarrollo.

            Puedes consultar los participantes
            y los resultados que estén disponibles.
          </p>

        </div>
      )}

      {/* TORNEO FINALIZADO */}
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

      {/* LISTADO DE PARTICIPANTES */}
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

      {/* CALENDARIO */}
      <div className="mb-4">

        <ListaPartidas
          partidas={partidasVisibles}
        />

      </div>

      {/* VOLVER */}
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
