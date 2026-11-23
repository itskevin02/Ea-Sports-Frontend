import { useEffect, useState } from 'react'

import { torneosService } from '../services/torneos'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'
import { partidasService } from '../services/partidas'
import { resultadosService } from '../services/resultados'

function Organizador() {

  const [torneos, setTorneos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [inscripciones, setInscripciones] = useState([])
  const [partidas, setPartidas] = useState([])
  const [resultados, setResultados] = useState([])

  const [torneoId, setTorneoId] = useState('')
  const [equipoAId, setEquipoAId] = useState('')
  const [equipoBId, setEquipoBId] = useState('')
  const [ronda, setRonda] = useState('Primera ronda')

  const [partidaId, setPartidaId] = useState('')
  const [puntajeA, setPuntajeA] = useState('')
  const [puntajeB, setPuntajeB] = useState('')

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function cargarDatos() {

    setCargando(true)
    setError('')

    const respuestas = await Promise.allSettled([
      torneosService.listar(),
      equiposService.listar(),
      inscripcionesService.listar(),
      partidasService.listar(),
      resultadosService.listar()
    ])

    const actualizar = [
      setTorneos,
      setEquipos,
      setInscripciones,
      setPartidas,
      setResultados
    ]

    respuestas.forEach((respuesta, indice) => {
      if (respuesta.status === 'fulfilled') {
        actualizar[indice](respuesta.value)
      }
    })

    const errores = respuestas.filter(
      (respuesta) => respuesta.status === 'rejected'
    )

    if (errores.length > 0) {
      setError(
        'No se pudo cargar toda la información. ' +
        'Revisa los microservicios e intenta actualizar.'
      )
    }

    setCargando(false)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  function nombreTorneo(id) {
    const torneo = torneos.find(
      (item) => Number(item.id) === Number(id)
    )

    return torneo ? torneo.nombre : `Torneo ${id}`
  }

  function nombreEquipo(id) {
    const equipo = equipos.find(
      (item) => Number(item.id) === Number(id)
    )

    return equipo ? equipo.nombre : `Equipo ${id}`
  }

  const equiposInscritos = inscripciones
    .filter((inscripcion) =>
      Number(inscripcion.torneoId) === Number(torneoId) &&
      String(inscripcion.estado).toUpperCase() === 'ACTIVO'
    )
    .map((inscripcion) =>
      equipos.find(
        (equipo) =>
          Number(equipo.id) === Number(inscripcion.equipoId)
      )
    )
    .filter(Boolean)

  const partidasPendientes = partidas.filter((partida) =>
    !resultados.some(
      (resultado) =>
        Number(resultado.partidaId) === Number(partida.id)
    )
  )

  async function crearPartida(evento) {

    evento.preventDefault()

    if (guardando) return

    setError('')
    setMensaje('')

    if (!torneoId || !equipoAId || !equipoBId) {
      setError('Debes seleccionar un torneo y dos equipos.')
      return
    }

    if (equipoAId === equipoBId) {
      setError('Los equipos participantes deben ser diferentes.')
      return
    }

    const equipoAValido = equiposInscritos.some(
      (equipo) => String(equipo.id) === equipoAId
    )

    const equipoBValido = equiposInscritos.some(
      (equipo) => String(equipo.id) === equipoBId
    )

    if (!equipoAValido || !equipoBValido) {
      setError('Ambos equipos deben estar inscritos en el torneo.')
      return
    }

    try {
      setGuardando(true)

      await partidasService.crear({
        torneoId: Number(torneoId),
        participanteAId: Number(equipoAId),
        participanteBId: Number(equipoBId),
        ronda: ronda,
        estado: 'PROGRAMADA'
      })

      setMensaje('Partida programada correctamente.')
      setEquipoAId('')
      setEquipoBId('')

      await cargarDatos()

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  async function registrarResultado(evento) {

    evento.preventDefault()

    if (guardando) return

    setError('')
    setMensaje('')

    const partida = partidas.find(
      (item) => String(item.id) === partidaId
    )

    if (!partida) {
      setError('Selecciona una partida.')
      return
    }

    if (puntajeA === '' || puntajeB === '') {
      setError('Ingresa ambos puntajes.')
      return
    }

    const puntosA = Number(puntajeA)
    const puntosB = Number(puntajeB)

    if (
      !Number.isInteger(puntosA) ||
      !Number.isInteger(puntosB) ||
      puntosA < 0 ||
      puntosB < 0
    ) {
      setError('Los puntajes deben ser números enteros no negativos.')
      return
    }

    if (puntosA === puntosB) {
      setError('No puede haber empate al definir un ganador.')
      return
    }

    const ganadorId = puntosA > puntosB
      ? partida.participanteAId
      : partida.participanteBId

    try {
      setGuardando(true)

      await resultadosService.crear({
        partidaId: partida.id,
        ganadorId: ganadorId,
        puntajeA: puntosA,
        puntajeB: puntosB,
        estadoValidacion: 'PENDIENTE'
      })

      setMensaje('Resultado registrado. Pendiente de validación.')

      setPartidaId('')
      setPuntajeA('')
      setPuntajeB('')

      await cargarDatos()

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  async function validarResultado(resultado) {

    if (guardando) return

    setError('')
    setMensaje('')

    try {
      setGuardando(true)

      await resultadosService.actualizar(resultado.id, {
        partidaId: resultado.partidaId,
        ganadorId: resultado.ganadorId,
        puntajeA: resultado.puntajeA,
        puntajeB: resultado.puntajeB,
        estadoValidacion: 'VALIDADO'
      })

      setMensaje('Resultado validado correctamente.')

      await cargarDatos()

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>

      <h2 className="mb-3">
        Panel del Organizador
      </h2>

      <p className="text-white-50 mb-4">
        Administra partidas y resultados de los torneos.
      </p>

      <button
        type="button"
        className="btn btn-outline-light mb-4"
        onClick={cargarDatos}
        disabled={cargando || guardando}
      >
        Actualizar datos
      </button>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success">
          {mensaje}
        </div>
      )}

      {cargando && (
        <div className="alert alert-info">
          Cargando información...
        </div>
      )}

      <section className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Inscripciones ({inscripciones.length})
          </h3>

          {inscripciones.length === 0 ? (
            <p>No hay inscripciones registradas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Torneo</th>
                    <th>Equipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {inscripciones.map((item) => (
                    <tr key={item.id}>
                      <td>{nombreTorneo(item.torneoId)}</td>
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

      <section className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Programar partida
          </h3>

         <form
            className="formulario-ep3 p-3 mb-4"
            onSubmit={crearPartida}
         >

            <div className="row g-3">

              <div className="col-12">
                <label htmlFor="torneoOrganizador" className="form-label">
                  Torneo
                </label>
                <select
                  id="torneoOrganizador"
                  className="form-select"
                  value={torneoId}
                  onChange={(evento) => {
                    setTorneoId(evento.target.value)
                    setEquipoAId('')
                    setEquipoBId('')
                  }}
                >
                  <option value="">Selecciona un torneo</option>
                  {torneos.map((torneo) => (
                    <option key={torneo.id} value={torneo.id}>
                      {torneo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="equipoA" className="form-label">
                  Equipo A
                </label>
                <select
                  id="equipoA"
                  className="form-select"
                  value={equipoAId}
                  onChange={(evento) => setEquipoAId(evento.target.value)}
                >
                  <option value="">Selecciona el equipo A</option>
                  {equiposInscritos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="equipoB" className="form-label">
                  Equipo B
                </label>
                <select
                  id="equipoB"
                  className="form-select"
                  value={equipoBId}
                  onChange={(evento) => setEquipoBId(evento.target.value)}
                >
                  <option value="">Selecciona el equipo B</option>
                  {equiposInscritos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label htmlFor="rondaPartida" className="form-label">
                  Ronda
                </label>
                <select
                  id="rondaPartida"
                  className="form-select"
                  value={ronda}
                  onChange={(evento) => setRonda(evento.target.value)}
                >
                  <option value="Primera ronda">Primera ronda</option>
                  <option value="Semifinal">Semifinal</option>
                  <option value="Final">Final</option>
                </select>
              </div>

            </div>

            {torneoId && equiposInscritos.length < 2 && (
              <div className="alert alert-warning mt-3">
                Se necesitan al menos dos equipos inscritos
                en este torneo para programar una partida.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={
                guardando ||
                !torneoId ||
                equiposInscritos.length < 2
              }
            >
              Programar partida
            </button>

          </form>

          <hr />

          <h4 className="h5 mb-3">
            Partidas ({partidas.length})
          </h4>

          {partidas.length === 0 ? (
            <p>No hay partidas programadas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Torneo</th>
                    <th>Equipo A</th>
                    <th>Equipo B</th>
                    <th>Ronda</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {partidas.map((partida) => (
                    <tr key={partida.id}>
                      <td>{partida.id}</td>
                      <td>{nombreTorneo(partida.torneoId)}</td>
                      <td>{nombreEquipo(partida.participanteAId)}</td>
                      <td>{nombreEquipo(partida.participanteBId)}</td>
                      <td>{partida.ronda}</td>
                      <td>{partida.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </section>

      <section className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Registrar resultado
          </h3>

          <form
            className="formulario-ep3 p-3 mb-4"
            onSubmit={registrarResultado}
         >

            <div className="row g-3">

              <div className="col-12">
                <label htmlFor="partidaResultado" className="form-label">
                  Partida
                </label>
                <select
                  id="partidaResultado"
                  className="form-select"
                  value={partidaId}
                  onChange={(evento) => {
                    setPartidaId(evento.target.value)
                    setPuntajeA('')
                    setPuntajeB('')
                  }}
                >
                  <option value="">Selecciona una partida</option>
                  {partidasPendientes.map((partida) => (
                    <option key={partida.id} value={partida.id}>
                      {nombreEquipo(partida.participanteAId)}
                      {' vs '}
                      {nombreEquipo(partida.participanteBId)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="puntajeA" className="form-label">
                  Puntaje A
                </label>
                <input
                  id="puntajeA"
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  value={puntajeA}
                  onChange={(evento) => setPuntajeA(evento.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="puntajeB" className="form-label">
                  Puntaje B
                </label>
                <input
                  id="puntajeB"
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  value={puntajeB}
                  onChange={(evento) => setPuntajeB(evento.target.value)}
                />
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={guardando || partidasPendientes.length === 0}
            >
              Registrar resultado
            </button>

          </form>

          <hr />

          <h4 className="h5 mb-3">
            Resultados ({resultados.length})
          </h4>

          {resultados.length === 0 ? (
            <p>No hay resultados registrados.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Partida</th>
                    <th>Ganador</th>
                    <th>Marcador</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((resultado) => (
                    <tr key={resultado.id}>
                      <td>{resultado.partidaId}</td>
                      <td>{nombreEquipo(resultado.ganadorId)}</td>
                      <td>
                        {resultado.puntajeA}
                        {' - '}
                        {resultado.puntajeB}
                      </td>
                      <td>{resultado.estadoValidacion}</td>
                      <td>
                        {resultado.estadoValidacion === 'PENDIENTE' ? (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => validarResultado(resultado)}
                            disabled={guardando}
                          >
                            Validar
                          </button>
                        ) : (
                          <span>Validado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}

export default Organizador
