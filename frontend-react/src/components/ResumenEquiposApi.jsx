
import { useState, useEffect } from 'react'

import { equiposService } from '../services/equipos'
import { juegosService } from '../services/juegos'

function ResumenEquiposApi() {

  // Datos del servidor
  const [equipos, setEquipos] = useState([])
  const [juegos, setJuegos] = useState([])

  // Estados de carga
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Formulario para crear equipos
  const [formulario, setFormulario] = useState({
    nombre: '',
    coach: '',
    juegoId: ''
  })

  // Mensajes del formulario
  const [guardando, setGuardando] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Consultar los microservicios Team y Game
  useEffect(() => {

    async function cargarDatos() {

      try {
        setCargando(true)
        setError('')

        const datosEquipos = await equiposService.listar()
        const datosJuegos = await juegosService.listar()

        setEquipos(datosEquipos)
        setJuegos(datosJuegos)

      } catch (err) {
        setError(err.message)

      } finally {
        setCargando(false)
      }
    }

    cargarDatos()

  }, [])

  // Actualizar campos del formulario
  function cambiarCampo(evento) {

    const { name, value } = evento.target

    setFormulario({
      ...formulario,
      [name]: value
    })

    setErrorFormulario('')
    setMensaje('')
  }

  // Crear equipo mediante la API
  async function crearEquipo(evento) {
    evento.preventDefault()

    setErrorFormulario('')
    setMensaje('')

    const nombre = formulario.nombre.trim()
    const coach = formulario.coach.trim()

    // Validar nombre
    if (nombre === '') {
      setErrorFormulario(
        'El nombre del equipo es obligatorio.'
      )
      return
    }

    // Validar coach
    if (coach === '') {
      setErrorFormulario(
        'El coach del equipo es obligatorio.'
      )
      return
    }

    // Validar juego
    if (formulario.juegoId === '') {
      setErrorFormulario(
        'Debes seleccionar un videojuego.'
      )
      return
    }

    // Evitar nombres repetidos
    const nombreRepetido = equipos.some(
      (equipo) =>
        equipo.nombre.toLowerCase() === nombre.toLowerCase()
    )

    if (nombreRepetido) {
      setErrorFormulario(
        'Ya existe un equipo con ese nombre.'
      )
      return
    }

    try {
      setGuardando(true)

      // Guardar equipo en Team
      const nuevoEquipo = await equiposService.crear({
        nombre: nombre,
        coach: coach,
        juegoId: Number(formulario.juegoId),
        estado: 'ACTIVO'
      })

      // Actualizar el listado desde el servidor
      const datosActualizados =
        await equiposService.listar()

      setEquipos(datosActualizados)

      // Limpiar formulario
      setFormulario({
        nombre: '',
        coach: '',
        juegoId: ''
      })

      setMensaje(
        `Equipo "${nuevoEquipo.nombre}" creado ` +
        'correctamente en el servidor.'
      )

    } catch (err) {
      setErrorFormulario(err.message)

    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="card mb-4 shadow-sm">

      <div className="card-body p-4">

        <h3 className="h5 mb-3">
          Equipos registrados en el servidor
        </h3>

        <p className="text-secondary mb-4">
          Información obtenida desde Team y Game
          mediante Gateway.
        </p>

        {/* CARGANDO */}
        {cargando && (
          <div className="alert alert-info">
            Cargando equipos del servidor...
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

            {/* CONTADOR DE EQUIPOS */}
            <div className="border rounded-3 p-3 mb-4">

              <p className="mb-1">
                Total de equipos registrados
              </p>

              <h4 className="mb-0">
                {equipos.length}
              </h4>

            </div>

            {/* FORMULARIO DE CREACION */}
            <div className="border border-secondary rounded-3 p-4 mb-4 bg-body-tertiary">

              <h4 className="h5 mb-2 text-dark">
                Crear equipo con API (EP3)
              </h4>

              <p className="text-secondary mb-4">
                Completa los datos para registrar
                un equipo en el servidor.
              </p>

              <form onSubmit={crearEquipo} noValidate>

                <div className="row g-4 text-start">

                  {/* NOMBRE DEL EQUIPO */}
                  <div className="col-12 col-md-4">

                    <label
                      htmlFor="nombreEquipoApi"
                      className="form-label fw-semibold d-block text-start text-dark"
                    >
                      Nombre del equipo
                    </label>

                    <input
                      type="text"
                      id="nombreEquipoApi"
                      name="nombre"
                      className="form-control form-control-lg bg-white border border-2 border-secondary text-dark"
                      placeholder="Ej.: Equipo Prueba EP3 C"
                      value={formulario.nombre}
                      onChange={cambiarCampo}
                      disabled={guardando}
                    />

                    <small className="text-secondary d-block mt-2 text-start">
                      Ingresa un nombre que no esté registrado.
                    </small>

                  </div>

                  {/* COACH */}
                  <div className="col-12 col-md-4">

                    <label
                      htmlFor="coachEquipoApi"
                      className="form-label fw-semibold d-block text-start text-dark"
                    >
                      Coach
                    </label>

                    <input
                      type="text"
                      id="coachEquipoApi"
                      name="coach"
                      className="form-control form-control-lg bg-white border border-2 border-secondary text-dark"
                      placeholder="Ej.: Coach Tercero"
                      value={formulario.coach}
                      onChange={cambiarCampo}
                      disabled={guardando}
                    />

                    <small className="text-secondary d-block mt-2 text-start">
                      Escribe el nombre del entrenador.
                    </small>

                  </div>

                  {/* VIDEOJUEGO */}
                  <div className="col-12 col-md-4">

                    <label
                      htmlFor="juegoEquipoApi"
                      className="form-label fw-semibold d-block text-start text-dark"
                    >
                      Videojuego
                    </label>

                    <select
                      id="juegoEquipoApi"
                      name="juegoId"
                      className="form-select form-select-lg bg-white border border-2 border-secondary text-dark"
                      value={formulario.juegoId}
                      onChange={cambiarCampo}
                      disabled={guardando}
                    >

                      <option value="">
                        Selecciona un videojuego
                      </option>

                      {juegos.map((juego) => (
                        <option
                          key={juego.id}
                          value={juego.id}
                        >
                          {juego.nombre}
                        </option>
                      ))}

                    </select>

                    <small className="text-secondary d-block mt-2 text-start">
                      Selecciona un juego registrado en la API.
                    </small>

                  </div>

                </div>

                {/* MENSAJE DE ERROR */}
                {errorFormulario && (
                  <div
                    className="alert alert-danger mt-4"
                    role="alert"
                  >
                    {errorFormulario}
                  </div>
                )}

                {/* MENSAJE DE CONFIRMACION */}
                {mensaje && (
                  <div
                    className="alert alert-success mt-4"
                    role="status"
                  >
                    {mensaje}
                  </div>
                )}

                {/* BOTON CREAR */}
                <div className="text-center mt-4">

                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2"
                    disabled={guardando}
                  >
                    {guardando
                      ? 'Guardando equipo...'
                      : 'Crear equipo en el servidor'}
                  </button>

                </div>

              </form>

            </div>

            {/* LISTADO DE EQUIPOS */}
            <h4 className="h5 mb-3">
              Listado de equipos del servidor
            </h4>

            {equipos.length === 0 ? (

              <div className="alert alert-info">
                No hay equipos registrados en el servidor.
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-dark table-striped align-middle">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Equipo</th>
                      <th>Coach</th>
                      <th>Juego</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>

                    {equipos.map((equipo) => {

                      // Buscar el videojuego del equipo
                      const juego = juegos.find(
                        (item) =>
                          Number(item.id) ===
                          Number(equipo.juegoId)
                      )

                      return (
                        <tr key={equipo.id}>

                          <td>
                            {equipo.id}
                          </td>

                          <td>
                            {equipo.nombre}
                          </td>

                          <td>
                            {equipo.coach}
                          </td>

                          <td>
                            {juego
                              ? juego.nombre
                              : `Juego ID ${equipo.juegoId}`}
                          </td>

                          <td>
                            {equipo.estado}
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

export default ResumenEquiposApi
