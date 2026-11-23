import { useEffect, useState } from 'react'

import { torneosService } from '../services/torneos'
import { juegosService } from '../services/juegos'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'
import { partidasService } from '../services/partidas'
import { resultadosService } from '../services/resultados'
import { rankingsService } from '../services/rankings'
import { premiosService } from '../services/premios'

function DetalleTorneoApi({ torneoId, onVolver }) {

  const [torneo, setTorneo] = useState(null)
  const [nombreJuego, setNombreJuego] = useState('')

  const [equipos, setEquipos] = useState([])
  const [inscripciones, setInscripciones] = useState([])
  const [partidas, setPartidas] = useState([])
  const [resultados, setResultados] = useState([])
  const [rankings, setRankings] = useState([])
  const [premios, setPremios] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {

    let activo = true

    async function cargarDatos() {

      try {
        setCargando(true)
        setError('')
        setAviso('')

        const datosTorneo =
          await torneosService.obtener(torneoId)

        if (!datosTorneo) {
          throw new Error('No se encontró el torneo.')
        }

        const respuestas = await Promise.allSettled([
          juegosService.obtener(datosTorneo.juegoId),
          equiposService.listar(),
          inscripcionesService.listar(),
          partidasService.listar(),
          resultadosService.listar(),
          rankingsService.listar(),
          premiosService.listar()
        ])

        if (!activo) return

        setTorneo(datosTorneo)

        setNombreJuego(
          respuestas[0].status === 'fulfilled'
            ? respuestas[0].value.nombre
            : `Juego ID ${datosTorneo.juegoId}`
        )

        setEquipos(
          respuestas[1].status === 'fulfilled'
            ? respuestas[1].value
            : []
        )

        setInscripciones(
          respuestas[2].status === 'fulfilled'
            ? respuestas[2].value
            : []
        )

        setPartidas(
          respuestas[3].status === 'fulfilled'
            ? respuestas[3].value
            : []
        )

        setResultados(
          respuestas[4].status === 'fulfilled'
            ? respuestas[4].value
            : []
        )

        setRankings(
          respuestas[5].status === 'fulfilled'
            ? respuestas[5].value
            : []
        )

        setPremios(
          respuestas[6].status === 'fulfilled'
            ? respuestas[6].value
            : []
        )

        if (respuestas.some(
          (respuesta) => respuesta.status === 'rejected'
        )) {
          setAviso(
            'Algunos datos no están disponibles. ' +
            'Revisa los microservicios.'
          )
        }

      } catch (err) {

        if (activo) {
          setError(err.message)
        }

      } finally {

        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarDatos()

    return () => {
      activo = false
    }

  }, [torneoId])

  function nombreEquipo(id) {

    const equipo = equipos.find(
      (item) => Number(item.id) === Number(id)
    )

    return equipo
      ? equipo.nombre
      : `Equipo ID ${id}`
  }

  const inscripcionesTorneo = inscripciones.filter(
    (item) => Number(item.torneoId) === Number(torneoId)
  )

  const partidasTorneo = partidas.filter(
    (item) => Number(item.torneoId) === Number(torneoId)
  )

  const rankingsTorneo = rankings
    .filter(
      (item) => Number(item.torneoId) === Number(torneoId)
    )
    .sort(
      (a, b) => Number(a.posicion) - Number(b.posicion)
    )

  const premiosTorneo = premios
    .filter(
      (item) => Number(item.torneoId) === Number(torneoId)
    )
    .sort(
      (a, b) => Number(a.posicion) - Number(b.posicion)
    )

  function buscarResultado(idPartida) {

    return resultados.find(
      (resultado) =>
        Number(resultado.partidaId) === Number(idPartida)
    )
  }

  if (cargando) {
    return (
      <div className="alert alert-info">
        Cargando información del torneo...
      </div>
    )
  }

  if (error || !torneo) {
    return (
      <div>
        <div className="alert alert-danger">
          {error || 'No se encontró el torneo.'}
        </div>

        <button
          type="button"
          className="btn btn-outline-light"
          onClick={onVolver}
        >
          Volver a Torneos
        </button>
      </div>
    )
  }

  return (
    <div>

      <h2 className="mb-4 text-center">
        Detalle del Torneo
      </h2>

      {aviso && (
        <div className="alert alert-warning">
          {aviso}
        </div>
      )}

      {/* INFORMACIÓN DEL TORNEO */}

      <section className="card mb-4">
        <div className="card-body p-4">

          <h3 className="h4 mb-3">
            {torneo.nombre}
          </h3>

          {torneo.imagen && (
            <img
              src={torneo.imagen}
              alt={torneo.nombre}
              className="img-fluid rounded mb-4"
              style={{
                maxHeight: '300px',
                objectFit: 'cover'
              }}
            />
          )}

          <p>
            <strong>Videojuego:</strong> {nombreJuego}
          </p>

          <p>
            <strong>Modalidad:</strong> {torneo.ubicacion}
          </p>

          <p>
            <strong>Plataforma:</strong> {torneo.plataforma}
          </p>

          <p>
            <strong>Estado:</strong> {torneo.estado}
          </p>

          <p>
            <strong>Cupos máximos:</strong> {torneo.cantidadEquipos}
          </p>

          <p>
            <strong>Cierre de inscripción:</strong> {torneo.fechaCierre}
          </p>

          <p>
            <strong>Inicio del torneo:</strong> {torneo.fechaInicio}
          </p>

          <hr />

          <h4 className="h5">
            Descripción
          </h4>

          <p>{torneo.descripcion}</p>

        </div>
      </section>

      {/* EQUIPOS INSCRITOS */}

      <section className="card mb-4">
        <div className="card-body p-4">

          <h3 className="h5 mb-3">
            Equipos inscritos ({inscripcionesTorneo.length})
          </h3>

          {inscripcionesTorneo.length === 0 ? (
            <p>No hay equipos inscritos.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">

                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {inscripcionesTorneo.map((item) => (
                    <tr key={item.id}>
                      <td>{nombreEquipo(item.equipoId)}</td>
                      <td>{item.estado}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </section>

      {/* PARTIDAS */}

      <section className="card mb-4">
        <div className="card-body p-4">

          <h3 className="h5 mb-3">
            Partidas ({partidasTorneo.length})
          </h3>

          {partidasTorneo.length === 0 ? (
            <p>No hay partidas programadas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">

                <thead>
                  <tr>
                    <th>Ronda</th>
                    <th>Equipo A</th>
                    <th>Equipo B</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {partidasTorneo.map((partida) => (
                    <tr key={partida.id}>
                      <td>{partida.ronda}</td>
                      <td>{nombreEquipo(partida.participanteAId)}</td>
                      <td>{nombreEquipo(partida.participanteBId)}</td>
                      <td>{partida.estado}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </section>

      {/* RESULTADOS */}

      <section className="card mb-4">
        <div className="card-body p-4">

          <h3 className="h5 mb-3">
            Resultados
          </h3>

          {partidasTorneo.length === 0 ? (
            <p>No hay resultados disponibles.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">

                <thead>
                  <tr>
                    <th>Partida</th>
                    <th>Marcador</th>
                    <th>Ganador</th>
                    <th>Validación</th>
                  </tr>
                </thead>

                <tbody>
                  {partidasTorneo.map((partida) => {

                    const resultado = buscarResultado(partida.id)

                    return (
                      <tr key={partida.id}>
                        <td>
                          {nombreEquipo(partida.participanteAId)}
                          {' vs '}
                          {nombreEquipo(partida.participanteBId)}
                        </td>

                        <td>
                          {resultado
                            ? `${resultado.puntajeA} - ${resultado.puntajeB}`
                            : 'Pendiente'}
                        </td>

                        <td>
                          {resultado
                            ? nombreEquipo(resultado.ganadorId)
                            : 'Sin definir'}
                        </td>

                        <td>
                          {resultado
                            ? resultado.estadoValidacion
                            : 'Sin resultado'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </section>

      {/* RANKING */}

      <section className="card mb-4">
        <div className="card-body p-4">

          <h3 className="h5 mb-3">
            Clasificación del torneo
          </h3>

          <p className="text-secondary">
            Clasificación registrada por la organización.
          </p>

          {rankingsTorneo.length === 0 ? (
            <p>No hay clasificaciones registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">

                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Equipo</th>
                    <th>Puntos</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {rankingsTorneo.map((ranking) => (
                    <tr key={ranking.id}>
                      <td>{ranking.posicion}</td>
                      <td>{ranking.nombreEquipo}</td>
                      <td>{ranking.puntos}</td>
                      <td>{ranking.estado}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </section>

      {/* PREMIOS */}

      <section className="card mb-4">
        <div className="card-body p-4">

          <h3 className="h5 mb-3">
            Premios del torneo
          </h3>

          {premiosTorneo.length === 0 ? (
            <p>No hay premios registrados.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">

                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Descripción</th>
                    <th>Valor</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {premiosTorneo.map((premio) => (
                    <tr key={premio.id}>
                      <td>{premio.posicion}</td>
                      <td>{premio.descripcion}</td>
                      <td>{premio.valor}</td>
                      <td>{premio.estado}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </section>

      <div className="text-center mt-4">
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={onVolver}
        >
          Volver a Torneos
        </button>
      </div>

    </div>
  )
}

export default DetalleTorneoApi
