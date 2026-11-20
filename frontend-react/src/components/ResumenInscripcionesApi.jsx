
import { useState, useEffect } from 'react'

import { torneosService } from '../services/torneos'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'

// Obtener la fecha de hoy
function obtenerFechaActual() {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function ResumenInscripcionesApi() {

  const [torneos, setTorneos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [inscripciones, setInscripciones] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Datos del nuevo formulario
  const [torneoId, setTorneoId] = useState('')
  const [equipoId, setEquipoId] = useState('')

  const [guardando, setGuardando] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Cargar los registros del servidor
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

  // Mostrar solamente equipos del mismo videojuego
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
      Number(inscripcion.torneoId) ===
      Number(torneoId)
  ).length

  const cuposDisponibles = torneoSeleccionado
    ? Math.max(
        0,
        Number(torneoSeleccionado.cantidadEquipos) - inscritos
      )
    : 0

  // Crear inscripción mediante Registration
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

    // Validaciones antes de enviar
    if (!torneo || !equipo) {
      setErrorFormulario(
        'Selecciona un torneo y un equipo.'
      )
      return
    }

    const estadoTorneo = torneo.estado.toLowerCase()

    if (estadoTorneo !== 'abierto' &&
        estadoTorneo !== 'activo') {
      setErrorFormulario(
        'El torneo no está abierto para inscripciones.'
      )
      return
    }

    if (torneo.fechaCierre < obtenerFechaActual()) {
      setErrorFormulario(
        'El plazo de inscripción ya terminó.'
      )
      return
    }

    if (equipo.estado.toUpperCase() !== 'ACTIVO') {
      setErrorFormulario(
        'El equipo seleccionado no está activo.'
      )
      return
    }

    if (cuposDisponibles <= 0) {
      setErrorFormulario(
        'El torneo ya no tiene cupos disponibles.'
      )
      return
    }

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

      // Enviar los datos al microservicio Registration
      const nuevaInscripcion =
        await inscripcionesService.crear({
          torneoId: Number(torneoId),
          equipoId: Number(equipoId),
          estado: 'ACTIVO'
        })

      // Actualizar el listado desde el servidor
      const datosActualizados =
        await inscripcionesService.listar()

      setInscripciones(datosActualizados)

      setMensaje(
        `Inscripción N° ${nuevaInscripcion.id} ` +
        'registrada correctamente en el servidor.'
      )

      setEquipoId('')

    } catch (err) {
      setErrorFormulario(err.message)

    } finally {
      setGuardando(false)
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

        {cargando && (
          <div className="alert alert-info">
            Cargando inscripciones del servidor...
          </div>
        )}

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
                  <p className="mb-1">Torneos</p>
                  <h4>{torneos.length}</h4>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">
                  <p className="mb-1">Equipos</p>
                  <h4>{equipos.length}</h4>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">
                  <p className="mb-1">Inscripciones</p>
                  <h4>{inscripciones.length}</h4>
                </div>
              </div>

            </div>

            {/* FORMULARIO REAL */}
            <div className="border rounded p-3 mb-4">

              <h4 className="h5 mb-3">
                Nueva inscripción con API (EP3)
              </h4>

              <form onSubmit={confirmarInscripcion}>

                <div className="row g-3">

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
                      disabled={guardando}
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
                      disabled={!torneoSeleccionado || guardando}
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

                {torneoSeleccionado && (
                  <p className="text-secondary mt-3 mb-0">
                    Cupos disponibles: {cuposDisponibles}
                  </p>
                )}

                {torneoSeleccionado &&
                  equiposDelJuego.length === 0 && (
                    <div className="alert alert-warning mt-3">
                      No hay equipos registrados
                      para este videojuego.
                    </div>
                  )}

                {errorFormulario && (
                  <div className="alert alert-danger mt-3">
                    {errorFormulario}
                  </div>
                )}

                {mensaje && (
                  <div className="alert alert-success mt-3">
                    {mensaje}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando inscripción...'
                    : 'Inscribir equipo en el servidor'}
                </button>

              </form>

            </div>

            {/* TABLA DE INSCRIPCIONES */}
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
                    </tr>
                  </thead>

                  <tbody>

                    {inscripciones.map((inscripcion) => {

                      const torneo = torneos.find(
                        (item) =>
                          Number(item.id) ===
                          Number(inscripcion.torneoId)
                      )

                      const equipo = equipos.find(
                        (item) =>
                          Number(item.id) ===
                          Number(inscripcion.equipoId)
                      )

                      return (
                        <tr key={inscripcion.id}>

                          <td>{inscripcion.id}</td>

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

                          <td>{inscripcion.estado}</td>

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
