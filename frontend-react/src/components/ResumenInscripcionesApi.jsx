
import { useEffect, useState } from 'react'

import { useAuth } from '../auth/useAuth'
import { torneosService } from '../services/torneos'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'

function obtenerFechaActual() {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function ResumenInscripcionesApi() {

  const { usuario } = useAuth()

  const esAdmin = usuario?.rol === 'ADMIN'
  const autenticado = Boolean(usuario?.authId)

  const [torneos, setTorneos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [inscripciones, setInscripciones] = useState([])

  const [torneoId, setTorneoId] = useState('')
  const [equipoId, setEquipoId] = useState('')

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  function puedeAdministrarEquipo(equipo) {

    if (!equipo) {
      return false
    }

    if (esAdmin) {
      return true
    }

    return (
      usuario?.authId != null &&
      equipo.authId != null &&
      Number(usuario.authId) === Number(equipo.authId)
    )
  }

  async function cargarDatos() {

    try {
      setCargando(true)
      setError('')

      const datosTorneos = await torneosService.listar()
      const datosEquipos = await equiposService.listar()
      const datosInscripciones = await inscripcionesService.listar()

      setTorneos(datosTorneos)
      setEquipos(datosEquipos)
      setInscripciones(datosInscripciones)

    } catch (err) {
      setError(err.message)

    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const torneoSeleccionado = torneos.find(
    (torneo) => String(torneo.id) === torneoId
  )

  const equiposDisponibles = equipos.filter((equipo) => {

    if (!torneoSeleccionado) {
      return false
    }

    return (
      Number(equipo.juegoId) ===
        Number(torneoSeleccionado.juegoId) &&
      puedeAdministrarEquipo(equipo)
    )
  })

  const inscritos = inscripciones.filter(
    (inscripcion) =>
      Number(inscripcion.torneoId) === Number(torneoId)
  ).length

  const cuposDisponibles = torneoSeleccionado
    ? Math.max(
        0,
        Number(torneoSeleccionado.cantidadEquipos) - inscritos
      )
    : 0

  async function confirmarInscripcion(evento) {

    evento.preventDefault()

    if (!autenticado || guardando) {
      return
    }

    setError('')
    setMensaje('')

    const torneo = torneos.find(
      (item) => String(item.id) === torneoId
    )

    const equipo = equipos.find(
      (item) => String(item.id) === equipoId
    )

    if (!torneo || !equipo) {
      setError('Selecciona un torneo y un equipo.')
      return
    }

    if (!puedeAdministrarEquipo(equipo)) {
      setError('No puedes inscribir un equipo ajeno.')
      return
    }

    const estadoTorneo = String(
      torneo.estado || ''
    ).toLowerCase()

    if (
      estadoTorneo !== 'abierto' &&
      estadoTorneo !== 'activo'
    ) {
      setError('El torneo no está abierto para inscripciones.')
      return
    }

    if (torneo.fechaCierre < obtenerFechaActual()) {
      setError('El plazo de inscripción ya terminó.')
      return
    }

    if (String(equipo.estado).toUpperCase() !== 'ACTIVO') {
      setError('El equipo seleccionado no está activo.')
      return
    }

    if (Number(equipo.juegoId) !== Number(torneo.juegoId)) {
      setError('El equipo no corresponde al juego del torneo.')
      return
    }

    if (cuposDisponibles <= 0) {
      setError('El torneo no tiene cupos disponibles.')
      return
    }

    const repetido = inscripciones.some(
      (inscripcion) =>
        Number(inscripcion.torneoId) === Number(torneoId) &&
        Number(inscripcion.equipoId) === Number(equipoId)
    )

    if (repetido) {
      setError('Este equipo ya está inscrito en el torneo.')
      return
    }

    try {
      setGuardando(true)

      const nueva = await inscripcionesService.crear({
        torneoId: Number(torneoId),
        equipoId: Number(equipoId),
        estado: 'ACTIVO'
      })

      const actualizadas = await inscripcionesService.listar()
      setInscripciones(actualizadas)

      setEquipoId('')

      setMensaje(
        `Inscripción N° ${nueva.id} registrada correctamente.`
      )

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  async function cancelarInscripcion(inscripcion) {

    const equipo = equipos.find(
      (item) => Number(item.id) === Number(inscripcion.equipoId)
    )

    if (!puedeAdministrarEquipo(equipo)) {
      setError('No puedes cancelar una inscripción ajena.')
      return
    }

    if (guardando || eliminandoId !== null) {
      return
    }

    const confirmar = window.confirm(
      `¿Deseas cancelar la inscripción N° ${inscripcion.id}?`
    )

    if (!confirmar) {
      return
    }

    setError('')
    setMensaje('')

    try {
      setEliminandoId(inscripcion.id)

      await inscripcionesService.eliminar(inscripcion.id)

      const actualizadas = await inscripcionesService.listar()
      setInscripciones(actualizadas)

      setMensaje('Inscripción cancelada correctamente.')

    } catch (err) {
      setError(err.message)

    } finally {
      setEliminandoId(null)
    }
  }

  function nombreTorneo(id) {

    const torneo = torneos.find(
      (item) => Number(item.id) === Number(id)
    )

    return torneo ? torneo.nombre : `Torneo ID ${id}`
  }

  function buscarEquipo(id) {

    return equipos.find(
      (item) => Number(item.id) === Number(id)
    )
  }

  return (
    <section className="card mb-4">

      <div className="card-body">

        <h3 className="h5 mb-3">
          Inscripciones registradas en el servidor
        </h3>

        <p className="text-secondary">
          Cada jugador puede inscribir sus equipos
          y cancelar sus propias inscripciones.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="alert alert-success" role="status">
            {mensaje}
          </div>
        )}

        {cargando && (
          <div className="alert alert-info">
            Cargando inscripciones...
          </div>
        )}

        {!cargando && (
          <>

            <div className="row g-3 mb-4">

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">

                  <p className="mb-1">Torneos</p>
                  <h4 className="mb-0">{torneos.length}</h4>

                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">

                  <p className="mb-1">Equipos</p>
                  <h4 className="mb-0">{equipos.length}</h4>

                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">

                  <p className="mb-1">Inscripciones</p>
                  <h4 className="mb-0">{inscripciones.length}</h4>

                </div>
              </div>

            </div>

            {autenticado ? (

              <div className="border rounded p-3 mb-4 formulario-ep3">

                <h4 className="h5 mb-3">
                  Nueva inscripción con API (EP3)
                </h4>

                <form onSubmit={confirmarInscripcion}>

                  <div className="row g-3">

                    <div className="col-12 col-md-6">

                      <label htmlFor="torneoApi" className="form-label">
                        Torneo
                      </label>

                      <select
                        id="torneoApi"
                        className="form-select"
                        value={torneoId}
                        onChange={(evento) => {
                          setTorneoId(evento.target.value)
                          setEquipoId('')
                          setError('')
                          setMensaje('')
                        }}
                        disabled={guardando || eliminandoId !== null}
                      >

                        <option value="">
                          Selecciona un torneo
                        </option>

                        {torneos.map((torneo) => (
                          <option key={torneo.id} value={torneo.id}>
                            {torneo.nombre}
                          </option>
                        ))}

                      </select>

                    </div>

                    <div className="col-12 col-md-6">

                      <label htmlFor="equipoApi" className="form-label">
                        Equipo
                      </label>

                      <select
                        id="equipoApi"
                        className="form-select"
                        value={equipoId}
                        onChange={(evento) => {
                          setEquipoId(evento.target.value)
                          setError('')
                          setMensaje('')
                        }}
                        disabled={
                          !torneoSeleccionado ||
                          guardando ||
                          eliminandoId !== null
                        }
                      >

                        <option value="">
                          Selecciona un equipo
                        </option>

                        {equiposDisponibles.map((equipo) => (
                          <option key={equipo.id} value={equipo.id}>
                            {equipo.nombre}
                          </option>
                        ))}

                      </select>

                    </div>

                  </div>

                  {torneoSeleccionado && (

                    <p className="text-secondary mt-3 mb-0">
                      Cupos disponibles: {cuposDisponibles}
                    </p>

                  )}

                  {torneoSeleccionado &&
                    equiposDisponibles.length === 0 && (

                      <div className="alert alert-warning mt-3">
                        No tienes equipos disponibles para
                        este videojuego.
                      </div>

                    )}

                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    disabled={guardando || eliminandoId !== null}
                  >
                    {guardando
                      ? 'Guardando inscripción...'
                      : 'Inscribir equipo en el servidor'}
                  </button>

                </form>

              </div>

            ) : (

              <div className="alert alert-info">
                Inicia sesión para inscribir un equipo.
              </div>

            )}

            <h4 className="h5 mb-3">
              Listado de inscripciones del servidor
            </h4>

            {inscripciones.length === 0 ? (

              <div className="alert alert-info">
                No hay inscripciones registradas.
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-dark table-striped">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Torneo</th>
                      <th>Equipo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>

                    {inscripciones.map((inscripcion) => {

                      const equipo = buscarEquipo(inscripcion.equipoId)

                      return (
                        <tr key={inscripcion.id}>

                          <td>{inscripcion.id}</td>

                          <td>{nombreTorneo(inscripcion.torneoId)}</td>

                          <td>
                            {equipo
                              ? equipo.nombre
                              : `Equipo ID ${inscripcion.equipoId}`}
                          </td>

                          <td>{inscripcion.estado}</td>

                          <td>

                            {puedeAdministrarEquipo(equipo) ? (

                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => cancelarInscripcion(inscripcion)}
                                disabled={guardando || eliminandoId !== null}
                              >
                                {eliminandoId === inscripcion.id
                                  ? 'Cancelando...'
                                  : 'Cancelar'}
                              </button>

                            ) : (

                              <span className="text-secondary">
                                Solo consulta
                              </span>

                            )}

                          </td>

                        </tr>
                      )
                    })}

                  </tbody>

                </table>

              </div>

            )}

          </>
        )}

      </div>

    </section>
  )
}

export default ResumenInscripcionesApi
