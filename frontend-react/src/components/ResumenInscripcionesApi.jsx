
import { useState, useEffect } from 'react'

import { torneosService } from '../services/torneos'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'

// Obtener la fecha actual
function obtenerFechaActual() {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function ResumenInscripcionesApi() {

  // Datos del servidor
  const [torneos, setTorneos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [inscripciones, setInscripciones] = useState([])

  // Estados de carga
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Datos del formulario
  const [torneoId, setTorneoId] = useState('')
  const [equipoId, setEquipoId] = useState('')

  // Estados para guardar y eliminar
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  // Mensajes
  const [errorFormulario, setErrorFormulario] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Cargar los datos de los microservicios
  useEffect(() => {

    async function cargarDatos() {

      try {
        setCargando(true)
        setError('')

        const datosTorneos = await torneosService.listar()
        const datosEquipos = await equiposService.listar()
        const datosInscripciones =
          await inscripcionesService.listar()

        setTorneos(datosTorneos)
        setEquipos(datosEquipos)
        setInscripciones(datosInscripciones)

      } catch (err) {
        setError(err.message)

      } finally {
        setCargando(false)
      }
    }

    cargarDatos()

  }, [])

  // Buscar el torneo seleccionado
  const torneoSeleccionado = torneos.find(
    (torneo) => String(torneo.id) === torneoId
  )

  // Mostrar equipos del mismo videojuego
  const equiposDelJuego = torneoSeleccionado
    ? equipos.filter(
        (equipo) =>
          Number(equipo.juegoId) ===
          Number(torneoSeleccionado.juegoId)
      )
    : []

  // Contar inscripciones del torneo
  const inscritos = inscripciones.filter(
    (inscripcion) =>
      Number(inscripcion.torneoId) === Number(torneoId)
  ).length

  // Calcular cupos disponibles
  const cuposDisponibles = torneoSeleccionado
    ? Math.max(
        0,
        Number(torneoSeleccionado.cantidadEquipos) - inscritos
      )
    : 0

  // CREAR INSCRIPCION
  async function confirmarInscripcion(evento) {
    evento.preventDefault()

    setErrorFormulario('')
    setMensaje('')

    const torneo = torneos.find(
      (item) => String(item.id) === torneoId
    )

    const equipo = equipos.find(
      (item) => String(item.id) === equipoId
    )

    // Validar torneo y equipo
    if (!torneo || !equipo) {
      setErrorFormulario(
        'Selecciona un torneo y un equipo.'
      )
      return
    }

    // Validar estado del torneo
    const estadoTorneo = String(
      torneo.estado || ''
    ).toLowerCase()

    if (estadoTorneo !== 'abierto' &&
        estadoTorneo !== 'activo') {
      setErrorFormulario(
        'El torneo no está abierto para inscripciones.'
      )
      return
    }

    // Validar fecha de cierre
    if (torneo.fechaCierre < obtenerFechaActual()) {
      setErrorFormulario(
        'El plazo de inscripción ya terminó.'
      )
      return
    }

    // Validar estado del equipo
    if (String(equipo.estado).toUpperCase() !== 'ACTIVO') {
      setErrorFormulario(
        'El equipo seleccionado no está activo.'
      )
      return
    }

    // Validar videojuego
    if (Number(equipo.juegoId) !== Number(torneo.juegoId)) {
      setErrorFormulario(
        'El equipo no corresponde al juego del torneo.'
      )
      return
    }

    // Validar cupos
    if (cuposDisponibles <= 0) {
      setErrorFormulario(
        'El torneo ya no tiene cupos disponibles.'
      )
      return
    }

    // Evitar inscripciones duplicadas
    const repetido = inscripciones.some(
      (registro) =>
        Number(registro.torneoId) === Number(torneoId) &&
        Number(registro.equipoId) === Number(equipoId)
    )

    if (repetido) {
      setErrorFormulario(
        'Este equipo ya está inscrito en el torneo.'
      )
      return
    }

    try {
      setGuardando(true)

      // Crear inscripción mediante Registration
      const nuevaInscripcion =
        await inscripcionesService.crear({
          torneoId: Number(torneoId),
          equipoId: Number(equipoId),
          estado: 'ACTIVO'
        })

      // Actualizar datos desde el servidor
      const datosActualizados =
        await inscripcionesService.listar()

      setInscripciones(datosActualizados)

      setMensaje(
        `Inscripción N° ${nuevaInscripcion.id} ` +
        'registrada correctamente en el servidor.'
      )

      // Limpiar equipo seleccionado
      setEquipoId('')

    } catch (err) {
      setErrorFormulario(err.message)

    } finally {
      setGuardando(false)
    }
  }

  // CANCELAR INSCRIPCION
  async function cancelarInscripcion(inscripcion) {

    // Solicitar confirmación
    const confirmar = window.confirm(
      `¿Deseas cancelar la inscripción N° ${inscripcion.id}?`
    )

    if (!confirmar) {
      return
    }

    setErrorFormulario('')
    setMensaje('')

    try {
      setEliminandoId(inscripcion.id)

      // Eliminar inscripción desde Registration
      await inscripcionesService.eliminar(inscripcion.id)

      // Actualizar la lista desde el servidor
      const datosActualizados =
        await inscripcionesService.listar()

      setInscripciones(datosActualizados)

      setMensaje(
        `Inscripción N° ${inscripcion.id} cancelada correctamente.`
      )

    } catch (err) {
      setErrorFormulario(err.message)

    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <section className="card mb-4">

      <div className="card-body">

        <h3 className="h5 mb-3">
          Inscripciones registradas en el servidor
        </h3>

        <p className="text-secondary">
          Información obtenida desde Tournament, Team
          y Registration mediante Gateway.
        </p>

        {/* CARGANDO */}
        {cargando && (
          <div className="alert alert-info">
            Cargando inscripciones del servidor...
          </div>
        )}

        {/* ERROR DE CONEXION */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <>

            {/* RESUMEN */}
            <div className="row g-3 mb-4">

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">

                  <p className="mb-1">
                    Torneos
                  </p>

                  <h4 className="mb-0">
                    {torneos.length}
                  </h4>

                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">

                  <p className="mb-1">
                    Equipos
                  </p>

                  <h4 className="mb-0">
                    {equipos.length}
                  </h4>

                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">

                  <p className="mb-1">
                    Inscripciones
                  </p>

                  <h4 className="mb-0">
                    {inscripciones.length}
                  </h4>

                </div>
              </div>

            </div>

            {/* FORMULARIO EP3 */}
            <div className="border rounded p-3 mb-4">

              <h4 className="h5 mb-3">
                Nueva inscripción con API (EP3)
              </h4>

              <form onSubmit={confirmarInscripcion}>

                <div className="row g-3">

                  {/* SELECCIONAR TORNEO */}
                  <div className="col-12 col-md-6">

                    <label
                      htmlFor="torneoApi"
                      className="form-label"
                    >
                      Torneo
                    </label>

                    <select
                      id="torneoApi"
                      className="form-select"
                      value={torneoId}
                      onChange={(evento) => {
                        setTorneoId(evento.target.value)
                        setEquipoId('')
                        setErrorFormulario('')
                        setMensaje('')
                      }}
                      disabled={guardando || eliminandoId !== null}
                    >

                      <option value="">
                        Selecciona un torneo
                      </option>

                      {torneos.map((torneo) => (
                        <option
                          key={torneo.id}
                          value={torneo.id}
                        >
                          {torneo.nombre}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* SELECCIONAR EQUIPO */}
                  <div className="col-12 col-md-6">

                    <label
                      htmlFor="equipoApi"
                      className="form-label"
                    >
                      Equipo
                    </label>

                    <select
                      id="equipoApi"
                      className="form-select"
                      value={equipoId}
                      onChange={(evento) => {
                        setEquipoId(evento.target.value)
                        setErrorFormulario('')
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

                      {equiposDelJuego.map((equipo) => (
                        <option
                          key={equipo.id}
                          value={equipo.id}
                        >
                          {equipo.nombre}
                        </option>
                      ))}

                    </select>

                  </div>

                </div>

                {/* CUPOS */}
                {torneoSeleccionado && (
                  <p className="text-secondary mt-3 mb-0">
                    Cupos disponibles: {cuposDisponibles}
                  </p>
                )}

                {/* SIN EQUIPOS DISPONIBLES */}
                {torneoSeleccionado &&
                  equiposDelJuego.length === 0 && (
                    <div className="alert alert-warning mt-3">
                      No hay equipos registrados para
                      este videojuego.
                    </div>
                  )}

                {/* ERROR DEL FORMULARIO */}
                {errorFormulario && (
                  <div
                    className="alert alert-danger mt-3"
                    role="alert"
                  >
                    {errorFormulario}
                  </div>
                )}

                {/* MENSAJE DE CONFIRMACION */}
                {mensaje && (
                  <div
                    className="alert alert-success mt-3"
                    role="status"
                  >
                    {mensaje}
                  </div>
                )}

                {/* BOTON INSCRIBIR */}
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  disabled={
                    guardando ||
                    eliminandoId !== null
                  }
                >
                  {guardando
                    ? 'Guardando inscripción...'
                    : 'Inscribir equipo en el servidor'}
                </button>

              </form>

            </div>

            {/* LISTADO */}
            <h4 className="h5 mb-3">
              Listado de inscripciones del servidor
            </h4>

            {inscripciones.length === 0 ? (

              <div className="alert alert-info">
                No hay inscripciones registradas
                en el servidor.
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

                      // Buscar nombre del torneo
                      const torneo = torneos.find(
                        (item) =>
                          Number(item.id) ===
                          Number(inscripcion.torneoId)
                      )

                      // Buscar nombre del equipo
                      const equipo = equipos.find(
                        (item) =>
                          Number(item.id) ===
                          Number(inscripcion.equipoId)
                      )

                      return (
                        <tr key={inscripcion.id}>

                          <td>
                            {inscripcion.id}
                          </td>

                          <td>
                            {torneo
                              ? torneo.nombre
                              : `Torneo ID ${inscripcion.torneoId}`}
                          </td>

                          <td>
                            {equipo
                              ? equipo.nombre
                              : `Equipo ID ${inscripcion.equipoId}`}
                          </td>

                          <td>
                            {inscripcion.estado}
                          </td>

                          {/* BOTON CANCELAR */}
                          <td>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                cancelarInscripcion(inscripcion)
                              }
                              disabled={
                                guardando ||
                                eliminandoId !== null
                              }
                            >
                              {eliminandoId === inscripcion.id
                                ? 'Cancelando...'
                                : 'Cancelar'}
                            </button>

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
