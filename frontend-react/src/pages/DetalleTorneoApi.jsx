import { useEffect, useState } from 'react'

import { torneosService } from '../services/torneos'
import { juegosService } from '../services/juegos'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'
import { partidasService } from '../services/partidas'
import { resultadosService } from '../services/resultados'

function DetalleTorneoApi({ torneoId, onVolver }) {

  const [torneo, setTorneo] = useState(null)
  const [nombreJuego, setNombreJuego] = useState('')
  const [equipos, setEquipos] = useState([])
  const [inscripciones, setInscripciones] = useState([])
  const [partidas, setPartidas] = useState([])
  const [resultados, setResultados] = useState([])

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

        const datosTorneo = await torneosService.obtener(torneoId)

        if (!datosTorneo) {
          throw new Error('No se encontró el torneo.')
        }

        const respuestas = await Promise.allSettled([
          juegosService.obtener(datosTorneo.juegoId),
          equiposService.listar(),
          inscripcionesService.listar(),
          partidasService.listar(),
          resultadosService.listar()
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

        if (respuestas.some(
          (respuesta) => respuesta.status === 'rejected'
        )) {
          setAviso(
            'Algunos datos no están disponibles. ' +
            'Comprueba que los microservicios estén iniciados.'
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

    return equipo ? equipo.nombre : `Equipo ID ${id}`
  }

  const inscripcionesTorneo = inscripciones.filter(
    (item) => Number(item.torneoId) === Number(torneoId)
  )

  const partidasTorneo = partidas.filter(
    (item) => Number(item.torneoId) === Number(torneoId)
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

      <h2 className="mb-4">
        Detalle del Torneo
      </h2>

      {aviso && (
        <div className="alert alert-warning">
          {aviso}
        </div>
      )}

      {/* INFORMACIÓN GENERAL */}

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
                    <th>Estado de inscripción</th>
                  </tr>
                </thead>

                <tbody>

                  {inscripcionesTorneo.map((inscripcion) => (
                    <tr key={inscripcion.id}>

                      <td>
                        {nombreEquipo(inscripcion.equipoId)}
                      </td>

                      <td>{inscripcion.estado}</td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </section>

      {/* PARTIDAS DEL TORNEO */}

      <section className="card mb-4">

        <div className="card-body p-4">

          <h3 className="h5 mb-3">
            Partidas ({partidasTorneo.length})
          </h3>

          {partidasTorneo.length === 0 ? (

            <p>Todavía no hay partidas programadas.</p>

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

                      <td>
                        {nombreEquipo(partida.participanteAId)}
                      </td>

                      <td>
                        {nombreEquipo(partida.participanteBId)}
                      </td>

                      <td>{partida.estado}</td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </section>

      {/* RESULTADOS DEL TORNEO */}

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
